import {useState} from "preact/hooks";

// Функция для минификации адреса
const shortAddress = (address) => {
    if (!address || address.length < 10) return address; // Если адрес короткий, возвращаем его как есть
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function CopyableInput({ value, className = '', onCopy = null }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            onCopy && onCopy(value);
        });
    };

    return (
        <span
            className={`flex items-center gap-4 border-2 border-black rounded-md bg-dcdcdc text-black px-2 py-1 w-full max-w-full overflow-hidden font-minecraft ${className}`}
            style={{
                backgroundColor: '#dcdcdc', // Фон контейнера
                borderStyle: 'solid',
                borderWidth: '2px',
            }}
        >
            {/* Поле для текста */}
            <input
                type="text"
                readOnly
                value={value} // Используем минифицированный адрес
                className="flex-1 bg-transparent outline-none cursor-default text-xs min-w-0 font-bold"
                style={{
                    color: '#000000', // Цвет текста
                }}
            />

            {/* Кнопка копирования */}
            <button
                onClick={handleCopy}
                className="flex-shrink-0 p-1 bg-gray-500 hover:bg-gray-700 rounded-md transition-colors"
                style={{
                    backgroundColor: copied ? '#fefcd0' : '#a0a0a0', // Фон кнопки при копировании и по умолчанию
                    borderColor: 'black',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                }}
                aria-label="Copy to clipboard"
            >
                {copied ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-700"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-black"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                    </svg>
                )}
            </button>
        </span>
    );
}

export function CopyField({label, value, loading}) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <span className="text-sm">{label}</span>
            <CopyableInput value={loading ? "Loading..." : value || "-"}/>
        </div>
    );
}