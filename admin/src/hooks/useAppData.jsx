import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { ERC20_ABI } from "../abis/erc20Abi.js";
import { ABI } from "../abis/ABI.js";
import toast from "react-hot-toast";

const API_URL = "https://forwardfactory.ai/api/network/userwebapp/admin/";
const APP_ID = "f0c9012c-a7ec-4a00-a330-da2080a5658b";
const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
    const value = useAppDataProvider();
    return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
    const context = useContext(AppDataContext);
    if (!context) throw new Error("useAppData must be used within AppDataProvider");
    return context;
}

function useAppDataProvider() {
    const [apiCache, setApiCache] = useState(null);
    const [state, setState] = useState({
        appData: null,
        contract: null,
        tokenAddress: null,
        totalAmount: null,
        releasedAmount: null,
        tokenTicker: "TKN",
        isContractActive: false,
        startTimestamp: null,
        endTimestamp: null,
        provider: null,
        signer: null,
        networkData: null,
        isLoading: false,
        error: null,
        contractStatus: "",
        contractStatusMessage: ""
    });

    // Helper function to calculate contract status
    const calculateContractStatus = useCallback((depositExecuted, startTime, endTime, released, amount) => {
        let status = "Unknown";
        let statusMessage = "Contract status is unknown.";
        const now = Date.now();

        if (!depositExecuted) {
            status = "Not funded";
            statusMessage = "The contract has not received the required deposit.";
        } else if (startTime == 0) {
            status = "Not started";
            statusMessage = "The contract has been deployed but has not started yet.";
        } else if (now < Number(startTime) * 1000) {
            status = "Waiting";
            statusMessage = "The contract has not started yet.";
        } else if (now >= Number(startTime) * 1000 && now < Number(endTime) * 1000) {
            status = "Active";
            statusMessage = "The contract is currently active.";
        } else if (now >= Number(endTime) * 1000 && released < amount) {
            status = "Expired";
            statusMessage = "The contract has expired. You may reclaim your funds.";
        } else if (released >= amount) {
            status = "Completed";
            statusMessage = "The contract has been fully executed. All funds released.";
        }

        return {
            status,
            statusMessage,
            isContractActive: depositExecuted && startTime > 0,
            startTimestamp: Number(startTime) * 1000,
            endTimestamp: Number(endTime) * 1000
        };
    }, []);

    // Helper function to fetch contract data
    const fetchContractData = useCallback(async (contract) => {
        const [depositExecuted, startTime, endTime, token, amount, released] = await Promise.all([
            contract.isDepositExecuted(),
            contract.startTime(),
            contract.endTime(),
            contract.USDT?.() || null,
            contract.amount?.() || 0,
            contract.totalReleasedAmount?.() || 0
        ]);

        return {
            depositExecuted,
            startTime,
            endTime,
            token,
            amount,
            released,
            totalAmount: amount ? ethers.formatUnits(amount, 18) : null,
            releasedAmount: released ? ethers.formatUnits(released, 18) : null
        };
    }, []);

    // Fetch all data - only use for initial load and when connection changes
    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Use cached API data if available, otherwise fetch it
            let apiData;
            if (apiCache) {
                apiData = apiCache;
            } else {
                const { data } = await axios.get(`${API_URL}${APP_ID}`);
                apiData = data;
                setApiCache(data); // Save to cache
            }

            if (!window.ethereum) {
                throw new Error("MetaMask not detected");
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const accounts = await provider.send("eth_accounts", []);
            if (accounts.length === 0) {
                throw new Error("Wallet not connected");
            }

            const contract = new ethers.Contract(apiData.contractAddress, ABI, signer);

            // Get contract data
            const contractData = await fetchContractData(contract);

            // Get token symbol
            let symbol = "TKN";
            if (contractData.token) {
                const tokenContract = new ethers.Contract(contractData.token, ERC20_ABI, provider);
                symbol = await tokenContract.symbol();
            }

            // Get network data
            const chainId = Number(apiData.deployedNetwork?.chainId);
            const networkName = apiData.deployedNetwork?.name || `Chain ${chainId}`;

            const networkData = {
                chainId,
                name: networkName
            };

            // Calculate contract status
            const statusData = calculateContractStatus(
                contractData.depositExecuted,
                contractData.startTime,
                contractData.endTime,
                contractData.released,
                contractData.amount
            );

            setState({
                appData: apiData,
                contract,
                tokenAddress: contractData.token,
                totalAmount: contractData.totalAmount,
                releasedAmount: contractData.releasedAmount,
                tokenTicker: symbol,
                isContractActive: statusData.isContractActive,
                startTimestamp: statusData.startTimestamp,
                endTimestamp: statusData.endTimestamp,
                provider,
                signer,
                networkData,
                isLoading: false,
                error: null,
                contractStatus: statusData.status,
                contractStatusMessage: statusData.statusMessage
            });

        } catch (err) {
            console.error("Initialization error:", err);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: err.message || "Failed to initialize contract data"
            }));
        }
    }, [apiCache, calculateContractStatus, fetchContractData]);

    // Function to update only dynamic contract data
    const updateContractData = useCallback(async () => {
        if (!state.contract || !state.provider || !state.signer) {
            console.log("Cannot update: contract or provider not initialized");
            toast.error("Cannot update: contract or provider not initialized");
            return;
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Only fetch the dynamic contract data
            const contractData = await fetchContractData(state.contract);

            // Calculate contract status
            const statusData = calculateContractStatus(
                contractData.depositExecuted,
                contractData.startTime,
                contractData.endTime,
                contractData.released,
                contractData.amount
            );

            setState(prev => ({
                ...prev,
                totalAmount: contractData.totalAmount,
                releasedAmount: contractData.releasedAmount,
                isContractActive: statusData.isContractActive,
                startTimestamp: statusData.startTimestamp,
                endTimestamp: statusData.endTimestamp,
                contractStatus: statusData.status,
                contractStatusMessage: statusData.statusMessage,
                isLoading: false
            }));
            toast.success("Update successful");
        } catch (err) {
            console.error("Update contract data error:", err);
            toast.error("Update contract data error");
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: err.message || "Failed to update contract data"
            }));
        }
    }, [state.contract, state.provider, state.signer, calculateContractStatus, fetchContractData]);

    // Reset cache when chain changes
    useEffect(() => {
        if (!window.ethereum) return;

        const handleChainChanged = () => {
            // Clear API cache on chain change to ensure we get correct data
            setApiCache(null);
            fetchData();
        };

        window.ethereum.on("chainChanged", handleChainChanged);

        return () => {
            window.ethereum.removeListener("chainChanged", handleChainChanged);
        };
    }, [fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        ...state,
        refreshData: fetchData,      // Full refresh (use sparingly)
        updateContractData           // Efficient update for dynamic data
    };
}