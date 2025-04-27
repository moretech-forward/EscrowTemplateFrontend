import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { Card, Input, Button } from 'pixel-retroui';

// Import the react-datepicker styles
import 'react-datepicker/dist/react-datepicker.css';
// Import our custom styles (should be imported after the default styles)
import '../assets/datepicker.css';

const InitializeEscrowForm = () => {
    // Initialize react-hook-form with setValue
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm();

    // Form submission state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Watch the amount value to display in the input
    const amountValue = watch('amount') || '';

    /**
     * Validates the contract period date
     * @param {Date} date - The selected date
     * @returns {boolean|string} - Returns true if valid or error message
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
     * @param {number} value - The amount value
     * @returns {boolean|string} - Returns true if valid or error message
     */
    const validateAmount = (value) => {
        if (!value) return 'Amount is required';
        if (isNaN(value)) return 'Amount must be a number';
        if (value <= 0) return 'Amount must be greater than 0';
        return true;
    };

    /**
     * Handle amount input change
     * @param {Event} e - The input change event
     */
    const handleAmountChange = (e) => {
        const value = e.target.value;
        // Use setValue to update the form value
        setValue('amount', value === '' ? undefined : parseFloat(value), {
            shouldValidate: true // Trigger validation on change
        });
    };

    /**
     * Simulates form submission with a delay
     * @param {Object} formData - The form data to submit
     * @returns {Promise} - Promise that resolves after simulated submission
     */
    const submitFormData = (formData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form Data:', formData);
                resolve(formData);
            }, 2000);
        });
    };

    /**
     * Form submission handler
     * @param {Object} data - The form data from react-hook-form
     */
    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            await submitFormData(data);
            alert('Form submitted successfully!');
        } catch (error) {
            alert('An error occurred while submitting the form.');
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
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amountValue}
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
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'Initialize'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default InitializeEscrowForm;