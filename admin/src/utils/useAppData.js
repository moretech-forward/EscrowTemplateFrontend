import { useState, useEffect, createContext, useContext } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { ERC20_ABI } from "../abis/erc20Abi.js";
import {ABI} from "../abis/ABI.js";

const API_BASE_URL = "https://forwardfactory.ai/api";
const USERWEBAPP_ADMIN_URL = `${API_BASE_URL}/network/userwebapp/admin/`;
const FIXED_APP_ID = "2ba66cce-e343-4be2-9bd4-fe2e46f45531";

// Создаём контекст
const AppDataContext = createContext(null);

/**
 * Кастомный хук для работы с данными приложения и контракта.
 */
export function useAppDataProvider() {
    const [appData, setAppData] = useState(null);
    const [contract, setContract] = useState(null);
    const [tokenAddress, setTokenAddress] = useState(null);
    const [totalAmount, setTotalAmount] = useState(null);
    const [releasedAmount, setReleasedAmount] = useState(null);
    const [tokenTicker, setTokenTicker] = useState("TKN");
    const [isContractActive, setIsContractActive] = useState(false);
    const [expiryTimestamp, setExpiryTimestamp] = useState(null);

    // Добавляем состояния для провайдера и сайнера
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                // Шаг 1: Получаем данные о контракте
                const res = await axios.get(`${USERWEBAPP_ADMIN_URL}${FIXED_APP_ID}`);
                const data = res.data;
                setAppData(data);

                console.log("=== Contract Metadata ===");
                console.log(`Contract Address: ${data.contractAddress}`);
                console.log(`Contract ABI: ${data.contractAbi ? "Loaded" : "Not Loaded"}`);
                console.log(`Other Metadata:`, { ...data, contractAddress: undefined, contractAbi: undefined });

                // Шаг 2: Проверяем, доступен ли MetaMask
                if (!window.ethereum) {
                    console.warn("MetaMask not detected.");
                    return;
                }

                const browserProvider = new ethers.BrowserProvider(window.ethereum);
                setProvider(browserProvider); // Устанавливаем провайдер в состояние

                // Шаг 3: Проверяем, подключён ли кошелёк
                const accounts = await browserProvider.send("eth_accounts", []);
                if (accounts.length === 0) {
                    console.warn("Wallet not connected. Please connect it manually in MetaMask.");
                    return;
                }

                const walletSigner = await browserProvider.getSigner();
                setSigner(walletSigner); // Устанавливаем сайнера в состояние

                const escrowContract = new ethers.Contract(data.contractAddress, ABI, walletSigner);
                setContract(escrowContract);

                // Определяем статус контракта
                const depositExecuted = await escrowContract.isDepositExecuted();
                const startTime = await escrowContract.startTime();
                const endTime = await escrowContract.endTime();

                console.log("=== Contract State ===");
                console.log(`Deposit Executed: ${depositExecuted}`);
                console.log(`Start Time: ${Number(startTime) * 1000}`);
                console.log(`End Time: ${Number(endTime) * 1000}`); // Вывод endDate в консоль

                setIsContractActive(depositExecuted && startTime > 0);
                setExpiryTimestamp(Number(endTime) * 1000); // Преобразуем в миллисекунды

                // Получаем Token Address из контракта
                if (escrowContract.USDT) {
                    const token = await escrowContract.USDT();
                    setTokenAddress(token);

                    // Получаем символ токена
                    const tokenContract = new ethers.Contract(token, ERC20_ABI, browserProvider);
                    const symbol = await tokenContract.symbol();
                    setTokenTicker(symbol);
                }

                if (escrowContract.amount && escrowContract.totalReleasedAmount) {
                    const [amountVal, releasedVal] = await Promise.all([
                        escrowContract.amount(),
                        escrowContract.totalReleasedAmount()
                    ]);

                    setTotalAmount(ethers.formatUnits(amountVal, 18));
                    setReleasedAmount(ethers.formatUnits(releasedVal, 18));
                }
            } catch (err) {
                console.error("Ошибка инициализации:", err);
            }
        };

        init();
    }, []);

    return {
        appData,
        contract,
        tokenAddress,
        totalAmount,
        releasedAmount,
        tokenTicker,
        isContractActive,
        expiryTimestamp,
        provider, // Возвращаем провайдер
        signer, // Возвращаем сайнера
    };
}

/**
 * Провайдер для AppDataContext.
 */
export function AppDataProvider({ children }) {
    const appData = useAppDataProvider();
    return (
        <AppDataContext.Provider value={appData}>
            {children}
        </AppDataContext.Provider>
    );
}

/**
 * Хук для использования AppDataContext.
 */
export function useAppData() {
    const context = useContext(AppDataContext);
    if (!context) {
        throw new Error("useAppData must be used within an AppDataProvider");
    }
    return context;
}