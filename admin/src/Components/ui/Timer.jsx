import { useEffect, useState } from 'preact/hooks';

/**
 * Timer component that counts down to a target timestamp
 * @param {Object} props
 * @param {number} props.targetTimestamp - Target timestamp in milliseconds
 * @param {boolean} props.isContractActive - Indicates if the contract is active
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Inline styles
 * @param {string} [props.expiredText] - Text to show when timer expires (default: "Contract expired")
 * @param {string} [props.inactiveText] - Text to show when contract is not active (default: "Contract not activated")
 */
export default function Timer({
                                  targetTimestamp,
                                  isContractActive = false,
                                  className = '',
                                  style = {},
                                  expiredText = 'Contract expired',
                                  inactiveText = 'Contract not activated'
                              }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [isExpired, setIsExpired] = useState(targetTimestamp <= Date.now());

    // Calculate remaining time
    function calculateTimeLeft() {
        const now = Date.now();
        return targetTimestamp > now ? targetTimestamp - now : 0;
    }

    // Update timer every second if contract is active
    useEffect(() => {
        if (!isContractActive || isExpired) return;

        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            if (newTimeLeft <= 0) {
                setIsExpired(true);
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetTimestamp, isExpired, isContractActive]);

    // Format time segments
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Format number with leading zero
    const formatNumber = (num) => num.toString().padStart(2, '0');

    // Determine color based on remaining time
    const getColor = () => {
        if (timeLeft <= 10000) return 'text-red-500'; // Красный (меньше 10 секунд)
        if (timeLeft <= 60000) return 'text-yellow-500'; // Желтый (меньше 1 минуты)
        return 'text-green-500'; // Зеленый (больше 1 минуты)
    };

    if (!isContractActive) {
        return (
            <div className={`flex flex-col items-center gap-4 ${className}`} style={style}>
                <div className="text-center text-lg font-bold text-gray-600 mt-2">
                    {inactiveText}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`} style={style}>
            <p className="texl-md sm:text-lg md:text-xl font-bold text-black">Remaining time until expiry</p>
            <div className="flex items-center gap-4">
                <AnimatedTimeSegment value={formatNumber(days)} label="days" />
                <StaticDivider />
                <AnimatedTimeSegment value={formatNumber(hours)} label="hrs" />
                <StaticDivider />
                <AnimatedTimeSegment value={formatNumber(mins)} label="mins" />
                <StaticDivider />
                <AnimatedTimeSegment value={formatNumber(secs)} label="secs" color={getColor()} />
            </div>

            {/* Показываем текст "Contract expired", если таймер истек */}
            {isExpired && (
                <div className="text-center text-lg font-bold text-red-600 mt-2">
                    {expiredText}
                </div>
            )}
        </div>
    );
}

// Subcomponent for static time segment display
function AnimatedTimeSegment({ value, label, color = 'text-black' }) {
    return (
        <div className="flex flex-col items-center min-w-[60px] sm:min-w-[70px]">
            <div
                className={`text-[24px] md:text-[32px] font-bold ${color} transition-colors duration-300`}
            >
                {value}
            </div>
            <div className="text-sm uppercase tracking-wider text-gray-600 mt-2">{label}</div>
        </div>
    );
}

// Subcomponent for static divider
function StaticDivider() {
    return (
        <div className="text-3xl font-bold text-gray-800 mx-[-0.5rem] relative top-[-0.25rem]">
            :
        </div>
    );
}