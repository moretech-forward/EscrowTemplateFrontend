import { create } from 'zustand';
import { ethers } from 'ethers';
import axios from 'axios';
import { ERC20_ABI } from '../abis/erc20Abi.js';
import { ABI } from '../abis/ABI.js';
import toast from 'react-hot-toast';
import {calculateContractStatus} from "@/utils/calculateContractStatus.js";

const API_URL = "https://forwardfactory.ai/api/network/userwebapp/admin/";
const APP_ID = "f0c9012c-a7ec-4a00-a330-da2080a5658b";


// Helper function to fetch contract data
const fetchContractData = async (contract) => {
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
};

export const useAppStore = create((set, get) => ({
    // State
    apiCache: null,
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
    contractStatusMessage: "",

    // Actions
    fetchData: async () => {
        set({ isLoading: true, error: null });

        try {
            // Use cached API data if available, otherwise fetch it
            let apiData;
            if (get().apiCache) {
                apiData = get().apiCache;
            } else {
                const { data } = await axios.get(`${API_URL}${APP_ID}`);
                apiData = data;
                set({ apiCache: data }); // Save to cache
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

            set({
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
            set({
                isLoading: false,
                error: err.message || "Failed to initialize contract data"
            });
        }
    },

    updateContractData: async () => {
        const { contract, provider, signer } = get();

        if (!contract || !provider || !signer) {
            console.log("Cannot update: contract or provider not initialized");
            toast.error("Cannot update: contract or provider not initialized");
            return;
        }

        set({ isLoading: true, error: null });

        try {
            // Only fetch the dynamic contract data
            const contractData = await fetchContractData(contract);

            // Calculate contract status
            const statusData = calculateContractStatus(
                contractData.depositExecuted,
                contractData.startTime,
                contractData.endTime,
                contractData.released,
                contractData.amount
            );

            set({
                totalAmount: contractData.totalAmount,
                releasedAmount: contractData.releasedAmount,
                isContractActive: statusData.isContractActive,
                startTimestamp: statusData.startTimestamp,
                endTimestamp: statusData.endTimestamp,
                contractStatus: statusData.status,
                contractStatusMessage: statusData.statusMessage,
                isLoading: false
            });

            toast.success("Update successful");
        } catch (err) {
            console.error("Update contract data error:", err);
            toast.error("Update contract data error");
            set({
                isLoading: false,
                error: err.message || "Failed to update contract data"
            });
        }
    },

    // Initialize the store with chain change event listener
    initializeEvents: () => {
        if (!window.ethereum) return;

        const handleChainChanged = () => {
            // Clear API cache on chain change to ensure we get correct data
            set({ apiCache: null });
            get().fetchData();
        };

        window.ethereum.on("chainChanged", handleChainChanged);

        // Run initial data fetch
        get().fetchData();

        // Return cleanup function
        return () => {
            window.ethereum.removeListener("chainChanged", handleChainChanged);
        };
    }
}));