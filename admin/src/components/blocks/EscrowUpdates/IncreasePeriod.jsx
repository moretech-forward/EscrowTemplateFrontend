import { useState, useCallback } from 'react';
import { Button, Input } from 'pixel-retroui';
import toast from 'react-hot-toast';

const TIME_UNITS = {
    days: 86400,
    hrs: 3600,
    mins: 60,
    secs: 1,
};

export default function IncreasePeriod({ contract }) {
    const [unit, setUnit] = useState('hrs');
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const isValid = useCallback((val) => {
        return val && parseFloat(val) > 0;
    }, []);

    const handleUnitChange = (selectedUnit) => {
        setUnit(selectedUnit);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValid(value)) {
            setError('Enter a valid positive number');
            return;
        }

        setError('');
        try {
            const seconds = parseFloat(value) * TIME_UNITS[unit];

            const txPromise = contract.addTime(seconds).then(tx => {
                toast.loading('Waiting for confirmation...');
                return tx.wait();
            });

            await toast.promise(txPromise, {
                loading: 'Processing increase period...',
                success: 'Period increased successfully!',
                error: 'Transaction failed.',
            });
        } catch (err) {
            console.error('Error increasing period:', err);
            toast.error(err.message || 'An unexpected error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label className="block mb-1 font-medium text-black">Increase Period</label>

            <div className="flex gap-2 mb-2">
                {Object.keys(TIME_UNITS).map((key) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => handleUnitChange(key)}
                        className={`px-2 py-1 text-[14px] font-bold lowercase transition-all duration-100
        ${
                            unit === key
                                ? 'bg-[#c281b5] text-[#fefccf] border-2 border-black shadow-[2px_2px_0_rgba(254,252,207,0.8)]'
                                : 'bg-white text-black border-2 border-black hover:shadow-[2px_2px_0_rgba(0,0,0,0.5)] hover:translate-x-px hover:translate-y-px'
                        }
      `}
                    >
                        {key}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-2">
                <Input
                    type="text"
                    placeholder="Enter value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="md:w-full md:flex-1"
                    borderColor={error ? '#ff0000' : 'black'}
                />
                <Button
                    type="submit"
                    bg="#c281b5"
                    textColor="#fefccf"
                    borderColor="black"
                    shadow="#fefccf"
                    className="w-auto py-1 px-4"
                >
                    Increase
                </Button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
    );
}