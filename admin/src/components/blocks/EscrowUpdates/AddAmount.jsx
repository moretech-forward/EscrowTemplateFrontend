import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import { approveTokenSpending } from '@/utils/utils.js';
import PixelInput from "@/components/ui/PixelInput.jsx";
import { Button } from 'pixel-retroui';

export default function AddAmount({ contract, signer, tokenAddress }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async ({ amount }) => {
        setIsSubmitting(true);

        try {
            const parsedAmount = ethers.parseUnits(amount, 18);

            await toast.promise(
                approveTokenSpending(signer, tokenAddress, contract.target, parsedAmount),
                {
                    loading: 'Approving token spending...',
                    success: 'Token approval successful!',
                    error: 'Token approval failed.',
                }
            );

            const txPromise = contract.addAmount(parsedAmount).then((tx) => {
                toast.loading('Waiting for confirmation...');
                return tx.wait();
            });

            await toast.promise(txPromise, {
                loading: 'Adding amount...',
                success: 'Amount added successfully!',
                error: 'Transaction failed.',
            });

            reset(); // clear input
        } catch (err) {
            console.error('Error adding amount:', err);
            toast.error(err.message || 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <label className="block mb-1 font-medium text-black">Add Amount</label>

            <div className="flex gap-2">
                <PixelInput
                    placeholder="Add amount"
                    type="text"
                    {...register('amount', {
                        required: 'Amount is required',
                        validate: (val) => {
                            const num = parseFloat(val);
                            return !isNaN(num) && num > 0 || 'Enter a valid amount greater than 0';
                        },
                    })}
                    borderColor={errors.amount ? '#ff0000' : 'black'}
                />

                <Button
                    type="submit"
                    bg="#c281b5"
                    textColor="#fefccf"
                    borderColor="black"
                    shadow="#fefccf"
                    className="w-auto py-1 px-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Processing...' : 'Add'}
                </Button>
            </div>

            {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
        </form>
    );
}
