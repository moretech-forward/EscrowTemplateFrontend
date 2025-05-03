import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card } from 'pixel-retroui';
import { useAppData } from '@/hooks/useAppData.jsx';
import { ethers } from 'ethers';
import { approveTokenSpending } from '@/utils/utils.js';

// UI Components
import { AmountInput } from './AmountInput.jsx';
import { DateInput } from './DateInput.jsx';
import { StatusMessage } from './StatusMessage.jsx';
import { SubmitButton } from './SubmitButton.jsx';

const InitializeEscrowForm = () => {
    const { contract, tokenAddress, signer, refreshData } = useAppData();
    const [status, setStatus] = useState({ loading: false, message: '', isError: false });

    const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: { amount: '', contractPeriod: null }
    });

    const handleDeposit = async (amount, durationInSeconds) => {
        try {
            setStatus({ loading: true, message: 'Approving token transfer...', isError: false });
            const amountInWei = ethers.parseUnits(amount, 18);
            await approveTokenSpending(signer, tokenAddress, contract.target, amountInWei);

            setStatus({ loading: true, message: 'Initializing escrow...', isError: false });
            const depositTx = await contract.deposit(amountInWei, durationInSeconds);
            console.log("Transaction sent:", depositTx.hash);

            const receipt = await depositTx.wait();

            if (receipt.status === 1) {
                console.log("Deposit successful!");
                setStatus({ loading: false, message: 'Escrow initialized successfully!', isError: false });

                setTimeout(() => {
                    refreshData();
                    setTimeout(() => setStatus({ loading: false, message: '', isError: false }), 3000);
                }, 1500);
            } else {
                console.error("Deposit failed!");
                setStatus({ loading: false, message: 'Deposit transaction failed', isError: true });
            }
        } catch (error) {
            console.error("Error during deposit:", error);
            setStatus({
                loading: false,
                message: `Error: ${error.message?.split('(')[0] || 'Transaction failed'}`,
                isError: true
            });
        }
    };

    const onSubmit = async ({ amount, contractPeriod }) => {
        if (!contract || !tokenAddress || !signer) {
            setStatus({ loading: false, message: 'Contract not initialized', isError: true });
            return;
        }

        const currentUnixTimestamp = Math.floor(Date.now() / 1000);
        const targetUnixTimestamp = Math.floor(contractPeriod.getTime() / 1000);
        const durationInSeconds = targetUnixTimestamp - currentUnixTimestamp;

        console.log('Current timestamp:', currentUnixTimestamp, '(' + new Date(currentUnixTimestamp * 1000).toUTCString() + ')');
        console.log('Target timestamp:', targetUnixTimestamp, '(' + new Date(targetUnixTimestamp * 1000).toUTCString() + ')');
        console.log('Duration in seconds:', durationInSeconds);
        console.log('Duration in hours:', durationInSeconds / 3600);

        if (durationInSeconds <= 0) {
            setStatus({ loading: false, message: 'Contract period must be in the future', isError: true });
            return;
        }

        await handleDeposit(amount, durationInSeconds);
    };

    return (
        <Card className="p-4">
            <h2 className="text-lg sm:text-xl font-bold text-center md:text-left mb-4">
                Initialize your Escrow
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col xl:flex-row gap-4 xl:gap-10 pr-3.5">
                    <AmountInput control={control} errors={errors} watch={watch} setValue={setValue} />
                    <DateInput control={control} errors={errors} />
                </div>

                <StatusMessage status={status} />

                <SubmitButton status={status} contract={contract} />
            </form>
        </Card>
    );
};

export default InitializeEscrowForm;