import { Card } from "pixel-retroui";
import Timer from "./Components/Timer.jsx";
import Table from "./Components/Table.jsx";
import CopyableInput from "./Components/CopyableInput.jsx";

export function App() {
    const headers = ['Type of Transaction', 'Amount', 'Transaction Date', 'Contract Expiry Date'];
    const rows = [
        ['Contract Initialization', 0, '2023-10-01', 30],
        ['Deposit Funds', 5000, '2023-10-02', 29],
        ['First Transfer', 1200, '2023-10-05', 26],
        ['Service Fee', -50, '2023-10-05', 26],
        ['Second Transfer', 800, '2023-10-08', 23],
        ['Bonus Payment', 200, '2023-10-10', 21],
        ['Third Transfer', 1500, '2023-10-12', 19],
        ['Penalty Charge', -100, '2023-10-15', 16],
        ['Fourth Transfer', 950, '2023-10-18', 13],
        ['System Refund', 75, '2023-10-20', 11],
        ['Final Transfer', 2200, '2023-10-22', 9],
        ['Early Withdrawal', -300, '2023-10-23', 8],
        ['Interest Payment', 180, '2023-10-25', 6],
        ['Security Deposit', 1000, '2023-10-27', 4],
        ['Contract Extension', 0, '2023-10-28', 30],
        ['Additional Funds', 2500, '2023-10-29', 29],
        ['Partial Withdrawal', -750, '2023-10-30', 28],
        ['Commission Fee', -30, '2023-10-31', 27],
        ['Reward Payment', 150, '2023-11-01', 26],
        ['Completion Bonus', 500, '2023-11-03', 24],
        ['Additional Funds', 2500, '2023-10-29', 29],
        ['Partial Withdrawal', -750, '2023-10-30', 28],
        ['Commission Fee', -30, '2023-10-31', 27],
        ['Reward Payment', 150, '2023-11-01', 26],
        ['Completion Bonus', 500, '2023-11-03', 24],
        ['Interest Payment', 180, '2023-10-25', 6],
        ['Security Deposit', 1000, '2023-10-27', 4],
        ['Contract Extension', 0, '2023-10-28', 30],
        ['Additional Funds', 2500, '2023-10-29', 29],
        ['Partial Withdrawal', -750, '2023-10-30', 28],
        ['Commission Fee', -30, '2023-10-31', 27],
        ['Reward Payment', 150, '2023-11-01', 26],
        ['Completion Bonus', 500, '2023-11-03', 24],
        ['Additional Funds', 2500, '2023-10-29', 29],
        ['Partial Withdrawal', -750, '2023-10-30', 28],
        ['Commission Fee', -30, '2023-10-31', 27],
        ['Reward Payment', 150, '2023-11-01', 26],
        ['Completion Bonus', 500, '2023-11-03', 24],
        ['Security Deposit', 1000, '2023-10-27', 4],
        ['Contract Extension', 0, '2023-10-28', 30],
        ['Additional Funds', 2500, '2023-10-29', 29],
        ['Partial Withdrawal', -750, '2023-10-30', 28],
        ['Commission Fee', -30, '2023-10-31', 27],
        ['Reward Payment', 150, '2023-11-01', 26],
        ['Completion Bonus', 500, '2023-11-03', 24],
        ['Additional Funds', 2500, '2023-10-29', 29],
        ['Partial Withdrawal', -750, '2023-10-30', 28],
        ['Commission Fee', -30, '2023-10-31', 27],
        ['Reward Payment', 150, '2023-11-01', 26],
        ['Completion Bonus', 500, '2023-11-03', 24]
    ];

    const handleRowClick = (row) => {
        console.log(`You clicked on: ${row[0]}`);
    };

    return (
        <div className="container pt-[40px] px-[20px] flex flex-col items-center">
            <p className="text-[24px] md:text-[32px] font-bold text-center">
                Escrow Template
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

                <Card className="flex flex-col gap-y-2 p-4">
                    <p className="flex justify-between"><span className="font-bold">StartDate:</span>
                        <span>Date</span></p>
                    <p className="flex justify-between"><span className="font-bold">EndDate:</span>
                        <span>Date</span></p>
                    <p className="flex justify-between"><span className="font-bold">Duration:</span>
                        <span>Date</span></p>
                </Card>
            </div>

            {/* Таймер - центрированный и увеличенный */}
            <div className="py-[20px] w-full mt-[30px] flex justify-center">
                <Timer
                    targetTimestamp={1745592973082}
                    className="scale-110" // Увеличение на 10%
                />
            </div>

            {/* Таблица - занимает всю ширину */}
            <div className="w-full max-w-[800px] mt-[30px]">
                <Card className="p-0">
                    <Table
                        headers={headers}
                        rows={rows}
                        className="w-full" // Занимает всю доступную ширину
                        onRowClick={handleRowClick}
                    />
                </Card>
            </div>

            {/* Последняя строка - две карточки рядом */}
            <div className="w-full mt-[30px] grid grid-cols-1 md:grid-cols-2 gap-[30px]">
                <Card className="flex flex-col gap-3 p-4 overflow-hidden">
                    <div className="flex flex-col gap-1.5 w-full">
                        <span className="text-sm">Escrow Contract Address:</span>
                        <CopyableInput value="0x48F14816a59BfEa338F6b1C8B3C080c65d858bA8"/>
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                        <span className="text-sm">Depositor Wallet Address:</span>
                        <CopyableInput value="0x48F14816a59BfEa338F6b1C8B3C080c65d858bA8"/>
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                        <span className="text-sm">Recipient Wallet Address:</span>
                        <CopyableInput value="0x48F14816a59BfEa338F6b1C8B3C080c65d858bA8"/>
                    </div>
                </Card>

                <Card className="flex items-center">
                    <p className="text-sm text-gray-400 sm:p-4">
                        <span className="font-bold">Note:</span> Funds in escrow can be withdrawn by the depositing
                        party only after contract expiration.
                    </p>
                </Card>
            </div>

            <p className="text-center pt-[40px] pb-[20px]">Build with ❤️ by Forward Factory</p>
        </div>
    )
}