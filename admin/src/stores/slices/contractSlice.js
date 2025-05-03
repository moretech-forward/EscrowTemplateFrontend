import { ethers } from "ethers";
import {ABI} from "@/abis/ABI.js";
import {ERC20_ABI} from "@/abis/erc20Abi.js";


export const contractSlice = (set, get) => ({
    fetchContractData: async () => {
        const { contract, provider } = get();
        if (!contract || !provider) return;

        try {
            const [depositExecuted, startTime, endTime, token, amount, released] = await Promise.all([
                contract.isDepositExecuted(),
                contract.startTime(),
                contract.endTime(),
                contract.USDT?.() || null,
                contract.amount?.() || 0,
                contract.totalReleasedAmount?.() || 0,
            ]);

            let symbol = "TKN";
            if (token) {
                const tokenContract = new ethers.Contract(token, ERC20_ABI, provider);
                symbol = await tokenContract.symbol();
            }

            set({
                tokenAddress: token,
                tokenTicker: symbol,
                totalAmount: amount ? ethers.formatUnits(amount, 18) : null,
                releasedAmount: released ? ethers.formatUnits(released, 18) : null,
            });

            // Обновляем статус на основе сырых данных
            get().updateContractStatusFromContractData({
                depositExecuted,
                startTime,
                endTime,
                amount,
                released,
            });
        } catch (err) {
            get().showToast("Failed to fetch contract data", "error");
        }
    },
});