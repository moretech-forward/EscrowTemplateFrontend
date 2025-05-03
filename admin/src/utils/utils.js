import { ethers } from "ethers";
import {ERC20_ABI} from "../abis/erc20Abi.js";

export const approveTokenSpending = async (signer, tokenAddress, spenderAddress, amountInWei) => {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

    try {
        console.log(`Calling approve for ${amountInWei.toString()} to contract address ${spenderAddress}`);
        const tx = await tokenContract.approve(spenderAddress, amountInWei);
        console.log('Approve transaction sent:', tx.hash);
        await tx.wait();
        console.log('Approve transaction confirmed.');
    } catch (error) {
        throw new Error(`Approve failed: ${error.message}`);
    }
};

export const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString();
};

export const calculateDuration = (start, end) => {
    if (!start || !end) return "N/A";

    const startTime = new Date(start);
    const endTime = new Date(end);

    // Calculate duration components
    const durationMs = endTime - startTime;
    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${String(days).padStart(2, "0")} D ${String(hours).padStart(2, "0")} H ${String(minutes).padStart(2, "0")} Mins`;
};
