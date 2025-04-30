import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { Card, Input, Button } from 'pixel-retroui';
import { useAppData } from '../utils/useAppData'; // Подключение контекста
import { ethers } from "ethers";

// Import the react-datepicker styles
import 'react-datepicker/dist/react-datepicker.css';
// Import our custom styles (should be imported after the default styles)
import '../assets/datepicker.css';
import { ERC20_ABI } from "../abis/erc20Abi.js";

const InitializeEscrowForm = () => {
    const { contract, tokenAddress, provider, signer } = useAppData(); // Используем данные контекста

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm();

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Watch the amount value to display in the input
    const amountValue = watch('amount') || '';

    /**
     * Validates the contract period date
     */
    const validateContractPeriod = (date) => {
        if (!date) return 'Contract Period is required';

        const now = new Date();
        const minDate = new Date(now.getTime() + 60 * 60 * 1000); // Minimum: current time + 1 hour

        if (date < now) return 'Date cannot be earlier than the current time';
        if (date < minDate) return 'Minimum contract period is 1 hour';

        return true;
    };

    /**
     * Validates the amount input
     */
    const validateAmount = (value) => {
        if (!value) return 'Amount is required';
        if (isNaN(value)) return 'Amount must be a number';
        if (parseFloat(value) <= 0) return 'Amount must be greater than 0';
        return true;
    };

    /**
     * Handle amount input change
     */
    const handleAmountChange = (e) => {
        const value = e.target.value;

        // Проверяем, что ввод соответствует числу с плавающей точкой или пустому значению
        if (/^(\d+(\.\d*)?|\.\d*)?$/.test(value)) {
            setValue('amount', value, {
                shouldValidate: true // Trigger validation on change
            });
        }
    };

    const submitToContract = async (amount, endDateTimestamp) => {
        if (!contract || !tokenAddress || !signer) {
            throw new Error('Contract, token, or signer is not initialized');
        }

        // Конвертируем сумму в wei
        const amountInWei = ethers.parseUnits(amount, 18); // Конвертируем сумму в wei

        // Подключаемся к токену
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

        // Шаг 1: Вызов approve
        try {
            console.log(`Calling approve for ${amountInWei.toString()} to contract address ${contract.target}`);
            const approveTx = await tokenContract.approve(contract.target, amountInWei);
            console.log('Approve transaction sent:', approveTx.hash);
            await approveTx.wait(); // Ждем подтверждения транзакции
            console.log('Approve transaction confirmed.');
        } catch (error) {
            throw new Error(`Approve failed: ${error.message}`);
        }

        // Шаг 2: Вызов deposit
        try {
            console.log(`Calling deposit with amount ${amountInWei.toString()} and period ending at ${endDateTimestamp}`);
            const depositTx = await contract.deposit(amountInWei, endDateTimestamp);
            console.log('Deposit transaction sent:', depositTx.hash);
            return depositTx.wait(); // Ждем подтверждения транзакции
        } catch (error) {
            throw new Error(`Deposit failed: ${error.message}`);
        }
    };

    /**
     * Form submission handler
     */
    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            // Извлекаем значения из data
            const { amount, contractPeriod } = data;

            // Обрабатываем дату и переводим в Unix timestamp
            const contractPeriodTimestamp = Math.floor(new Date(contractPeriod).getTime() / 1000);

            const txReceipt = await submitToContract(amount, contractPeriodTimestamp);
            // Логируем данные
            console.log("Amount:", amount);
            console.log("Contract Period (Timestamp):", contractPeriodTimestamp);
        } catch (error) {
            alert(`An error occurred: ${error.message}`);
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Custom DatePicker input to match pixel-retroui style
    const PixelDatePickerInput = React.forwardRef(({ value, onClick, error }, ref) => (
        <input
            className={`pixel-datepicker-input ${error ? 'border-red-500' : 'border-black'}`}
            onClick={onClick}
            ref={ref}
            value={value}
            readOnly
            placeholder="Select date and time"
        />
    ));

    return (
        <Card className="p-4">
            <h2 className="text-lg sm:text-xl font-bold text-center md:text-left text-black mb-4">
                Initialize your Escrow
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col xl:flex-row gap-4 xl:gap-10 pr-3.5">
                    {/* Amount Field */}
                    <div className="flex-1">
                        <label htmlFor="amount" className="block text-sm font-medium text-black mb-1">
                            Amount
                        </label>
                        <Controller
                            name="amount"
                            control={control}
                            rules={{
                                validate: validateAmount
                            }}
                            render={({ field }) => (
                                <Input
                                    id="amount"
                                    type="text" // Используем текстовый тип для поддержки чисел с плавающей точкой
                                    placeholder="Enter amount"
                                    value={amountValue}
                                    onChange={handleAmountChange}
                                    bg="transparent"
                                    textColor="black"
                                    borderColor={errors.amount ? '#ff0000' : 'black'}
                                    className="w-full"
                                    disabled={!contract || isSubmitting} // Отключаем, если контракт не загружен
                                />
                            )}
                        />
                        {errors.amount && (
                            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                        )}
                    </div>

                    {/* Contract Period Field */}
                    <div className="flex-1">
                        <label htmlFor="contractPeriod" className="block text-sm font-medium text-black mb-1">
                            Contract Period
                        </label>

                        <Controller
                            name="contractPeriod"
                            control={control}
                            rules={{
                                validate: validateContractPeriod
                            }}
                            render={({ field }) => (
                                <div className="date-picker-container">
                                    <DatePicker
                                        id="contractPeriod"
                                        selected={field.value}
                                        onChange={(date) => field.onChange(date)}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        minDate={new Date()}
                                        customInput={
                                            <PixelDatePickerInput error={errors.contractPeriod} />
                                        }
                                        disabled={!contract || isSubmitting} // Отключаем, если контракт не загружен
                                    />
                                </div>
                            )}
                        />

                        {errors.contractPeriod && (
                            <p className="text-red-500 text-sm mt-1">{errors.contractPeriod.message}</p>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="w-full pr-8 mt-2">
                    <Button
                        type="submit"
                        bg="#c281b5"
                        textColor="#fefccf"
                        borderColor="black"
                        shadow="#fefccf"
                        className="py-1 w-full"
                        disabled={!contract || isSubmitting} // Отключаем кнопку, если контракт не загружен
                    >
                        {isSubmitting ? 'Processing...' : 'Initialize'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default InitializeEscrowForm;