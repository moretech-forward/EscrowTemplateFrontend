import {AppDataProvider, useAppData} from "./hooks/useAppData.jsx";
import {Button, ProgressBar} from "pixel-retroui";
import Timer from "@/components/ui/Timer.jsx";
import InitializeEscrowCard from "@/components/blocks/InitializeEscrow/InitializeEscrowCard.jsx";
import EscrowUpdatesCard from "@/components/blocks/EscrowUpdates/EscrowUpdatesCard.jsx";
import {useEffect} from "react";
import toast, {Toaster} from "react-hot-toast";
import FundsCard from "@/components/blocks/InfoCards/FundsCard.jsx";
import DetailsCard from "@/components/blocks/InfoCards/DetailsCard.jsx";


export function App() {
    return (
        <AppDataProvider>
            <Toaster toastOptions={{duration: 3000}} position='top-right'/>
            <div className="container pt-[40px] px-[20px] flex flex-col items-center">
                <AppContent/>
            </div>
        </AppDataProvider>
    );
}

function AppContent() {
    const {
        isContractActive,
        startTimestamp,
        endTimestamp,
        networkData,
        provider,
        error
    } = useAppData();

    useEffect(() => {
        if (provider) {
            toast.success("Connected!");
        } else if (error) {
            toast.error(error.message);
        } else {
            toast.loading("Connecting...");
        }
    }, [provider, error]);

    return (
        <>
            <div className="flex items-center w-full justify-between">
                <p className="text-[24px] md:text-[32px] font-bold text-center flex items-center md:gap-2">
                    Admin Panel
                    {networkData && (
                        <span
                            className="ml-2 text-[16px] md:text-[20px] font-normal px-3 py-1 bg-gray-100 rounded-full">
                        {networkData.name}
                      </span>
                    )}
                </p>
                <Button>Refund</Button>
            </div>

            {/* Info Cards */}
            <div className="w-full mt-[40px] grid grid-cols-1 md:grid-cols-2 gap-[30px]">
                <FundsCard/>
                <DetailsCard/>
            </div>

            {/* Timer */}
            <div className="py-[20px] w-full mt-[30px] flex justify-center">
                <Timer
                    className="md:scale-110"
                    startTimestamp={startTimestamp}
                    endTimestamp={endTimestamp}
                    isContractActive={isContractActive}
                />
            </div>

            {/* Actions */}
            <div className="w-full mt-[40px] grid grid-cols-1 md:grid-cols-2 gap-[30px] items-start">
                <InitializeEscrowCard/>
                <EscrowUpdatesCard/>
            </div>

            {/* Footer */}
            <p className="text-center pt-[40px] pb-[20px]">
                Built with ❤️ by Forward Factory
                <span className={`font-bold ${isContractActive ? "text-green-500" : "text-yellow-500"}`}>
          {` • Contract ${isContractActive ? "active" : "not activated"}`}
        </span>
            </p>
        </>
    );
}

