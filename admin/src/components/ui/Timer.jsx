import { useEffect, useState } from 'preact/hooks';
import { Fragment } from "react";

export default function Timer({
                                  startTimestamp,
                                  endTimestamp,
                                  isContractActive = false,
                                  className = '',
                                  style = {}
                              }) {
    const isValid = typeof startTimestamp === 'number' && typeof endTimestamp === 'number' && endTimestamp > startTimestamp;
    const [timeLeft, setTimeLeft] = useState(() =>
        isValid ? Math.max(0, endTimestamp - Date.now()) : 0
    );
    const [isExpired, setIsExpired] = useState(() =>
        isValid ? timeLeft <= 0 : false
    );
    const totalDuration = isValid ? endTimestamp - startTimestamp : 0;

    useEffect(() => {
        if (!isValid) {
            setIsExpired(false);
            setTimeLeft(0);
            return;
        }

        const newTimeLeft = Math.max(0, endTimestamp - Date.now());
        setTimeLeft(newTimeLeft);
        setIsExpired(newTimeLeft <= 0);

        if (!isContractActive || newTimeLeft <= 0) return;

        const timer = setInterval(() => {
            const remaining = Math.max(0, endTimestamp - Date.now());
            setTimeLeft(remaining);
            if (remaining <= 0) {
                setIsExpired(true);
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [startTimestamp, endTimestamp, isContractActive, isValid]);

    const days = Math.floor(timeLeft / 86400000);
    const hours = Math.floor((timeLeft % 86400000) / 3600000);
    const mins = Math.floor((timeLeft % 3600000) / 60000);
    const secs = Math.floor((timeLeft % 60000) / 1000);

    const format = num => num.toString().padStart(2, '0');

    const percentage = totalDuration > 0 ? timeLeft / totalDuration : 1;
    let color = 'text-green-500';
    if (percentage <= 0.125) color = 'text-red-500';
    else if (percentage <= 0.25) color = 'text-orange-500';
    else if (percentage <= 0.5) color = 'text-yellow-500';

    const segments = [
        { value: format(isValid ? days : 0), label: "days" },
        { value: format(isValid ? hours : 0), label: "hrs" },
        { value: format(isValid ? mins : 0), label: "mins" },
        { value: format(isValid ? secs : 0), label: "secs", color }
    ];

    if (!isContractActive) {
        return (
            <div className={`flex flex-col items-center gap-4 ${className}`} style={style}>
                <div className="text-center text-lg font-bold text-gray-600 mt-2">
                    Contract not activated
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`} style={style}>
            <p className="text-md sm:text-lg md:text-xl font-bold text-black">
                Remaining time until expiry
            </p>
            <div className="flex items-center gap-4">
                {segments.map((segment, i) => (
                    <Fragment key={segment.label}>
                        <TimeSegment {...segment} />
                        {i < 3 && <div className="text-3xl font-bold text-gray-800 mx-[-0.5rem] relative top-[-0.25rem]">:</div>}
                    </Fragment>
                ))}
            </div>

            {isExpired && (
                <div className="text-center text-lg font-bold text-red-600 mt-2">
                    Contract expired
                </div>
            )}
        </div>
    );
}

function TimeSegment({ value, label, color = 'text-black' }) {
    return (
        <div className="flex flex-col items-center min-w-[60px] sm:min-w-[70px]">
            <div className={`text-[24px] md:text-[32px] font-bold ${color} transition-colors duration-300`}>
                {value}
            </div>
            <div className="text-sm uppercase tracking-wider text-gray-600 mt-2">{label}</div>
        </div>
    );
}
