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