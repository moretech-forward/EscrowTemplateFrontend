// src/components/ui/DateInput.jsx
import React from 'react';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import '@/css/datepicker.css'
import 'react-datepicker/dist/react-datepicker.css';
import {useAppData} from "@/hooks/useAppData.jsx";

const DateInputField = React.forwardRef(({ value, onClick, error }, ref) => (
    <input
        className={`pixel-datepicker-input ${error ? 'border-red-500' : 'border-black'}`}
        onClick={onClick}
        ref={ref}
        value={value}
        readOnly
        placeholder="Select date and time"
    />
));

export const DateInput = ({ control, errors }) => {
    const {contract} = useAppData();

    const validateDate = (date) => {
        if (!date) return 'Required';
        if (date < new Date(Date.now() + 30 * 60 * 1000)) return 'Min period is 1 hour';
        return true;
    };

    return (
        <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Contract Period</label>
            <Controller
                name="contractPeriod"
                control={control}
                rules={{ validate: validateDate }}
                render={({ field }) => (
                    <div className="date-picker-container">
                        <DatePicker
                            selected={field.value}
                            onChange={field.onChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={5}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            minDate={new Date()}
                            customInput={<DateInputField error={errors.contractPeriod} />}
                            disabled={status.loading || !contract}
                        />
                    </div>
                )}
            />
            {errors.contractPeriod && (
                <p className="text-red-500 text-sm mt-1">{errors.contractPeriod.message}</p>
            )}
        </div>
    );
};