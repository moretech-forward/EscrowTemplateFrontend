import { useState } from 'react';
import { Card, Input, Button } from 'pixel-retroui';
import { useAppData } from '../utils/useAppData'; // Подключаем контекст данных приложения
import { ethers } from 'ethers';
import {approveTokenSpending} from "../utils/utils.js";

export default function EscrowUpdatesCard() {
    // Данные контекста
    const { contract, signer, tokenAddress } = useAppData();

    // State для значений инпутов
    const [addAmount, setAddAmount] = useState('');
    const [increasePeriod, setIncreasePeriod] = useState('');
    const [releaseAmount, setReleaseAmount] = useState('');

    // State для ошибок валидации
    const [addAmountError, setAddAmountError] = useState('');
    const [increasePeriodError, setIncreasePeriodError] = useState('');
    const [releaseAmountError, setReleaseAmountError] = useState('');

    // State для статуса отправки
    const [isAddAmountSubmitting, setIsAddAmountSubmitting] = useState(false);
    const [isIncreasePeriodSubmitting, setIsIncreasePeriodSubmitting] = useState(false);
    const [isReleaseAmountSubmitting, setIsReleaseAmountSubmitting] = useState(false);

    // Handle Add Amount input change
    const handleAddAmountChange = (e) => {
        const value = e.target.value;
        if (isValidFloat(value)) {
            setAddAmount(value);
            if (!value) {
                setAddAmountError('Add Amount is required');
            } else if (parseFloat(value) <= 0) {
                setAddAmountError('Amount must be greater than 0');
            } else {
                setAddAmountError('');
            }
        }
    };


    // Handle Increase Period input change
    const handleIncreasePeriodChange = (e) => {
        const value = e.target.value;

        // Только целые положительные числа (можно оставить пустым)
        if (/^\d*$/.test(value)) {
            setIncreasePeriod(value);

            if (!value) {
                setIncreasePeriodError('Increase Period is required');
            } else if (parseInt(value, 10) < 1) {
                setIncreasePeriodError('Period must be at least 1 hour');
            } else {
                setIncreasePeriodError('');
            }
        }
    };


    // Handle Release Amount input change
    const handleReleaseAmountChange = (e) => {
        const value = e.target.value;
        if (isValidFloat(value)) {
            setReleaseAmount(value);
            if (!value) {
                setReleaseAmountError('Release Amount is required');
            } else if (parseFloat(value) <= 0) {
                setReleaseAmountError('Amount must be greater than 0');
            } else {
                setReleaseAmountError('');
            }
        }
    };


    const isValidFloat = (value) => /^(\d+(\.\d{0,18})?)?$/.test(value);

    // Логика для Add Amount
    const handleAddAmountSubmit = async (e) => {
        e.preventDefault();

        if (!addAmount || parseFloat(addAmount) <= 0) {
            setAddAmountError('Invalid Add Amount');
            return;
        }

        try {
            setIsAddAmountSubmitting(true);
            const amountInWei = ethers.parseUnits(addAmount, 18);

            // Вызов approve
            await approveTokenSpending(signer, tokenAddress, contract.target, amountInWei);

            // После подтверждения — addAmount
            console.log('Calling addAmount with:', amountInWei.toString());
            const tx = await contract.addAmount(amountInWei);
            console.log('Add Amount transaction sent:', tx.hash);

            const receipt = await tx.wait();
            console.log('Add Amount transaction confirmed:', receipt);

            alert('Amount successfully added!');
            setAddAmount('');
        } catch (error) {
            console.error('Error adding amount:', error);
            alert(`Failed to add amount: ${error.message}`);
        } finally {
            setIsAddAmountSubmitting(false);
        }
    };

    // Логика для Increase Period
    const handleIncreasePeriodSubmit = async (e) => {
        e.preventDefault();

        if (!increasePeriod || parseFloat(increasePeriod) < 1) {
            setIncreasePeriodError('Invalid Increase Period');
            return;
        }

        try {
            setIsIncreasePeriodSubmitting(true);
            const periodInSeconds = parseInt(increasePeriod, 10) * 3600; // Конвертируем часы в секунды

            console.log('Calling addTime with:', periodInSeconds);
            const tx = await contract.addTime(periodInSeconds); // Вызов функции addTime
            console.log('Increase Period transaction sent:', tx.hash);

            const receipt = await tx.wait();
            console.log('Increase Period transaction confirmed:', receipt);

            alert('Period successfully increased!');
            setIncreasePeriod(''); // Сбрасываем ввод
        } catch (error) {
            console.error('Error increasing period:', error);
            alert(`Failed to increase period: ${error.message}`);
        } finally {
            setIsIncreasePeriodSubmitting(false);
        }
    };

    // Логика для Release Amount
    const handleReleaseAmountSubmit = async (e) => {
        e.preventDefault();

        if (!releaseAmount || parseFloat(releaseAmount) <= 0) {
            setReleaseAmountError('Invalid Release Amount');
            return;
        }

        try {
            setIsReleaseAmountSubmitting(true);
            const amountInWei = ethers.parseUnits(releaseAmount, 18); // Конвертируем сумму в wei

            console.log('Calling release with:', amountInWei.toString());
            const tx = await contract.release(amountInWei); // Вызов функции release
            console.log('Release Amount transaction sent:', tx.hash);

            const receipt = await tx.wait();
            console.log('Release Amount transaction confirmed:', receipt);

            alert('Amount successfully released!');
            setReleaseAmount(''); // Сбрасываем ввод
        } catch (error) {
            console.error('Error releasing amount:', error);
            alert(`Failed to release amount: ${error.message}`);
        } finally {
            setIsReleaseAmountSubmitting(false);
        }
    };

    return (
        <Card className="p-4">
            <h2 className="text-lg sm:text-xl font-bold text-center md:text-left text-black mb-4">
                Escrow Updates
            </h2>
            <div className="flex flex-col gap-4">
                {/* Add Amount Form */}
                <form onSubmit={handleAddAmountSubmit} className="flex flex-col gap-1">
                    <label htmlFor="addAmount" className="block mb-1 font-medium text-black">
                        Add Amount
                    </label>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                        <Input
                            id="addAmount"
                            type="text"
                            placeholder="Enter amount"
                            value={addAmount}
                            onChange={handleAddAmountChange}
                            bg="transparent"
                            textColor="black"
                            borderColor={addAmountError ? '#ff0000' : 'black'}
                            className="md:w-full md:flex-1"
                        />
                        <Button
                            type="submit"
                            bg="#c281b5"
                            textColor="#fefccf"
                            borderColor="black"
                            shadow="#fefccf"
                            className="w-auto py-1 px-4"
                            disabled={isAddAmountSubmitting}
                        >
                            {isAddAmountSubmitting ? 'Processing...' : 'Add'}
                        </Button>
                    </div>
                    {addAmountError && (
                        <p className="text-red-500 text-sm mt-1">{addAmountError}</p>
                    )}
                </form>

                {/* Increase Period Form */}
                <form onSubmit={handleIncreasePeriodSubmit} className="flex flex-col gap-1">
                    <label htmlFor="increasePeriod" className="block mb-1 font-medium text-black">
                        Increase Period
                    </label>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                        <Input
                            id="increasePeriod"
                            type="text"
                            placeholder="Enter hours"
                            value={increasePeriod}
                            onChange={handleIncreasePeriodChange}
                            bg="transparent"
                            textColor="black"
                            borderColor={increasePeriodError ? '#ff0000' : 'black'}
                            className="md:w-full md:flex-1"
                        />
                        <Button
                            type="submit"
                            bg="#c281b5"
                            textColor="#fefccf"
                            borderColor="black"
                            shadow="#fefccf"
                            className="w-auto py-1 px-4"
                            disabled={isIncreasePeriodSubmitting}
                        >
                            {isIncreasePeriodSubmitting ? 'Processing...' : 'Increase'}
                        </Button>
                    </div>
                    {increasePeriodError && (
                        <p className="text-red-500 text-sm mt-1">{increasePeriodError}</p>
                    )}
                </form>

                {/* Release Amount Form */}
                <form onSubmit={handleReleaseAmountSubmit} className="flex flex-col gap-1">
                    <label htmlFor="releaseAmount" className="block mb-1 font-medium text-black">
                        Release Amount
                    </label>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                        <Input
                            id="releaseAmount"
                            type="text"
                            placeholder="Enter amount"
                            value={releaseAmount}
                            onChange={handleReleaseAmountChange}
                            bg="transparent"
                            textColor="black"
                            borderColor={releaseAmountError ? '#ff0000' : 'black'}
                            className="md:w-full md:flex-1"
                        />
                        <Button
                            type="submit"
                            bg="#c281b5"
                            textColor="#fefccf"
                            borderColor="black"
                            shadow="#fefccf"
                            className="w-auto py-1 px-4"
                            disabled={isReleaseAmountSubmitting}
                        >
                            {isReleaseAmountSubmitting ? 'Processing...' : 'Release'}
                        </Button>
                    </div>
                    {releaseAmountError && (
                        <p className="text-red-500 text-sm mt-1">{releaseAmountError}</p>
                    )}
                </form>
            </div>
        </Card>
    );
}