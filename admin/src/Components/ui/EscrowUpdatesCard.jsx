import { useState } from 'react';
import { Card, Input, Button } from 'pixel-retroui';

export default function EscrowUpdatesCard() {
    // State for input values
    const [addAmount, setAddAmount] = useState('');
    const [increasePeriod, setIncreasePeriod] = useState('');
    const [releaseAmount, setReleaseAmount] = useState('');

    // State for validation errors
    const [addAmountError, setAddAmountError] = useState('');
    const [increasePeriodError, setIncreasePeriodError] = useState('');
    const [releaseAmountError, setReleaseAmountError] = useState('');

    // State for submission status
    const [isAddAmountSubmitting, setIsAddAmountSubmitting] = useState(false);
    const [isIncreasePeriodSubmitting, setIsIncreasePeriodSubmitting] = useState(false);
    const [isReleaseAmountSubmitting, setIsReleaseAmountSubmitting] = useState(false);

    // Handle Add Amount input change
    const handleAddAmountChange = (e) => {
        const value = e.target.value;
        setAddAmount(value);

        if (!value) {
            setAddAmountError('Add Amount is required');
        } else if (parseFloat(value) <= 0) {
            setAddAmountError('Amount must be greater than 0');
        } else {
            setAddAmountError('');
        }
    };

    // Handle Increase Period input change
    const handleIncreasePeriodChange = (e) => {
        const value = e.target.value;
        setIncreasePeriod(value);

        if (!value) {
            setIncreasePeriodError('Increase Period is required');
        } else if (parseFloat(value) < 1) {
            setIncreasePeriodError('Period must be at least 1 hour');
        } else {
            setIncreasePeriodError('');
        }
    };

    // Handle Release Amount input change
    const handleReleaseAmountChange = (e) => {
        const value = e.target.value;
        setReleaseAmount(value);

        if (!value) {
            setReleaseAmountError('Release Amount is required');
        } else if (parseFloat(value) <= 0) {
            setReleaseAmountError('Amount must be greater than 0');
        } else {
            setReleaseAmountError('');
        }
    };

    // Simulate form submission with a delay
    const simulateSubmission = (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form Data:', data);
                resolve(data);
            }, 1500);
        });
    };

    // Add Amount submit handler
    const handleAddAmountSubmit = async (e) => {
        e.preventDefault();

        // Validate before submission
        if (!addAmount) {
            setAddAmountError('Add Amount is required');
            return;
        } else if (parseFloat(addAmount) <= 0) {
            setAddAmountError('Amount must be greater than 0');
            return;
        }

        try {
            setIsAddAmountSubmitting(true);
            const data = { addAmount: parseFloat(addAmount) };
            await simulateSubmission(data);
            console.log('Add Amount submitted:', data);
            // Reset form after successful submission
            setAddAmount('');
        } catch (error) {
            console.error('Error adding amount:', error);
        } finally {
            setIsAddAmountSubmitting(false);
        }
    };

    // Increase Period submit handler
    const handleIncreasePeriodSubmit = async (e) => {
        e.preventDefault();

        // Validate before submission
        if (!increasePeriod) {
            setIncreasePeriodError('Increase Period is required');
            return;
        } else if (parseFloat(increasePeriod) < 1) {
            setIncreasePeriodError('Period must be at least 1 hour');
            return;
        }

        try {
            setIsIncreasePeriodSubmitting(true);
            const data = { increasePeriod: parseFloat(increasePeriod) };
            await simulateSubmission(data);
            console.log('Increase Period submitted:', data);
            // Reset form after successful submission
            setIncreasePeriod('');
        } catch (error) {
            console.error('Error increasing period:', error);
        } finally {
            setIsIncreasePeriodSubmitting(false);
        }
    };

    // Release Amount submit handler
    const handleReleaseAmountSubmit = async (e) => {
        e.preventDefault();

        // Validate before submission
        if (!releaseAmount) {
            setReleaseAmountError('Release Amount is required');
            return;
        } else if (parseFloat(releaseAmount) <= 0) {
            setReleaseAmountError('Amount must be greater than 0');
            return;
        }

        try {
            setIsReleaseAmountSubmitting(true);
            const data = { releaseAmount: parseFloat(releaseAmount) };
            await simulateSubmission(data);
            console.log('Release Amount submitted:', data);
            // Reset form after successful submission
            setReleaseAmount('');
        } catch (error) {
            console.error('Error releasing amount:', error);
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
                            type="number"
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
                            type="number"
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
                            type="number"
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