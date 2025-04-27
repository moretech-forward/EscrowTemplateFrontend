import { Card } from "pixel-retroui";
import Timer from "./Components/ui/Timer.jsx";
import CopyableInput from "./Components/ui/CopyableInput.jsx";
import InitializeEscrowCard from "./Components/InitializeEscrowCard.jsx";
import EscrowUpdatesCard from "./Components/ui/EscrowUpdatesCard.jsx";

export function App() {
    const headers = ['Type of Transaction', 'Amount', 'Transaction Date', 'Contract Expiry Date'];

    const handleRowClick = (row) => {
        console.log(`You clicked on: ${row[0]}`);
    };

    return (
        <div className="container pt-[40px] px-[20px] flex flex-col items-center">
            <p className="text-[24px] md:text-[32px] font-bold text-center">
                Admin Panel
            </p>

            {/* Первая строка - две карточки рядом */}
            <div className="w-full mt-[40px] grid grid-cols-1 md:grid-cols-2 gap-[30px]">
                <Card className="p-4 flex flex-col gap-3">
                    <p className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-bold shrink-0">Total Funds In Escrow:</span>
                        <span>Amount TICKER</span>
                    </p>
                    <p className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-bold shrink-0">Released amount:</span>
                        <span>Amount TICKER</span>
                    </p>
                </Card>

                <Card className="flex flex-col gap-3 p-4 overflow-hidden">
                    <div className="flex flex-col gap-1.5 w-full">
                        <span className="text-sm">Escrow Contract Address:</span>
                        <CopyableInput value="0x48F14816a59BfEa338F6b1C8B3C080c65d858bA8"/>
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                        <span className="text-sm">Token Address:</span>
                        <CopyableInput value="0x48F14816a59BfEa338F6b1C8B3C080c65d858bA8"/>
                    </div>
                </Card>
            </div>

            {/* Таймер - центрированный и увеличенный */}
            <div className="py-[20px] w-full mt-[30px] flex justify-center">
                <Timer
                    targetTimestamp={1745592973082}
                    className="md:scale-110" // Увеличение на 10%
                />
            </div>

            <div className="w-full mt-[40px] grid grid-cols-1 md:grid-cols-2 gap-[30px] items-start">
                <InitializeEscrowCard />
                <EscrowUpdatesCard />
            </div>

            <p className="text-center pt-[40px] pb-[20px]">Build with ❤️ by Forward Factory</p>
        </div>
    )
}