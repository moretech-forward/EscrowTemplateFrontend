import { useState, useCallback } from 'react';
import { Input, Button } from 'pixel-retroui';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';

export default function ReleaseAmount({ contract }) {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isValid = useCallback((val) => {
        return val && parseFloat(val) > 0;
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValid(value)) {
            setError('Enter a valid amount greater than 0');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            const amount = ethers.parseUnits(value, 18);

            const txPromise = contract.release(amount).then(tx => {
                toast.loading('Waiting for confirmation...');
                return tx.wait();
            });

            await toast.promise(txPromise, {
                loading: 'Releasing amount...',
                success: 'Amount released successfully!',
                error: 'Transaction failed.',
            });
        } catch (err) {
            console.error('Error releasing amount:', err);
            toast.error(err.message || 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label className="block mb-1 font-medium text-black">Release Amount</label>

            <div className="flex items-center gap-2">
                <Input
                    type="text"
                    placeholder="Enter amount"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    borderColor={error ? '#ff0000' : 'black'}
                    className="md:w-full md:flex-1"
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
                    {isSubmitting ? 'Processing...' : 'Release'}
                </Button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
    );
}