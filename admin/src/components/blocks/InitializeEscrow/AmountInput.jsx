import React from 'react';
import { Controller } from 'react-hook-form';
import { Input } from 'pixel-retroui';

export const AmountInput = ({ control, errors, watch, setValue }) => {
    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (/^(\d+(\.\d*)?|\.\d*)?$/.test(value)) {
            setValue('amount', value, { shouldValidate: true });
        }
    };

    return (
        <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Amount</label>
            <Controller
                name="amount"
                control={control}
                rules={{
                    required: 'Amount is required',
                    validate: value =>
                        (!value || isNaN(value) || parseFloat(value) <= 0)
                            ? 'Enter a valid amount greater than 0'
                            : true,
                }}
                render={({ field }) => (
                    <Input
                        type="text"
                        placeholder="Enter amount"
                        value={watch('amount')}
                        onChange={handleAmountChange}
                        bg="transparent"
                        textColor="black"
                        borderColor={errors.amount ? '#ff0000' : 'black'}
                        className="w-full"
                    />
                )}
            />
            {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
            )}
        </div>
    );
};