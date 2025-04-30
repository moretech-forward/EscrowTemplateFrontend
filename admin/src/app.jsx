import { AppDataProvider, useAppData } from "./utils/useAppData"; // Убедитесь, что путь правильный
import { Card } from "pixel-retroui";
import Timer from "./Components/ui/Timer.jsx";
import CopyableInput from "./Components/ui/CopyableInput.jsx";
import InitializeEscrowCard from "./Components/InitializeEscrowCard.jsx";
import EscrowUpdatesCard from "./Components/EscrowUpdatesCard.jsx";

export function App() {
    return (
        <AppDataProvider>
            <div className="container pt-[40px] px-[20px] flex flex-col items-center">
                <p className="text-[24px] md:text-[32px] font-bold text-center">
                    Admin Panel
                </p>

                <AppContent />
            </div>
        </AppDataProvider>
    );
}

function AppContent() {
    const {
        totalAmount,
        releasedAmount,
        tokenTicker,
        tokenAddress,
        isContractActive,
        expiryTimestamp,
        appData,
    } = useAppData();

    return (
        <>
            <div className="w-full mt-[40px] grid grid-cols-1 md:grid-cols-2 gap-[30px]">
                <Card className="p-4 flex flex-col gap-3">
                    <p className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-bold shrink-0">Total Funds In Escrow:</span>
                        <span>{totalAmount ? `${totalAmount} ${tokenTicker}` : "Loading..."}</span>
                    </p>
                    <p className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-bold shrink-0">Released amount:</span>
                        <span>{releasedAmount ? `${releasedAmount} ${tokenTicker}` : "Loading..."}</span>
                    </p>
                </Card>

                <Card className="flex flex-col gap-3 p-4 overflow-hidden">
                    <div className="flex flex-col gap-1.5 w-full">
                        <span className="text-sm">Escrow Contract Address:</span>
                        <CopyableInput value={appData?.contractAddress || "Loading..."}/>
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                        <span className="text-sm">Token Address:</span>
                        <CopyableInput value={tokenAddress || "Loading..."}/>
                    </div>
                </Card>
            </div>

            <div className="py-[20px] w-full mt-[30px] flex justify-center">
                <Timer
                    className="md:scale-110"
                    targetTimestamp={String(expiryTimestamp)}
                    isContractActive={isContractActive}
                    expiredText="Contract expired"
                    inactiveText="Contract not activated"
                />
            </div>

            <div className="w-full mt-[40px] grid grid-cols-1 md:grid-cols-2 gap-[30px] items-start">
                <InitializeEscrowCard />
                <EscrowUpdatesCard />
            </div>

            <p className="text-center pt-[40px] pb-[20px]">Build with ❤️ by Forward Factory</p>
        </>
    );
}