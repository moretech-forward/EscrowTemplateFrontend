import { Card } from "pixel-retroui";
import RefreshButton from "@/components/ui/RefreshButton.jsx";
import { calculateDuration, formatDate } from "@/utils/utils.js";
import InfoRow from "@/components/ui/InfoRow.jsx";
import { useAppStore } from "@/stores/useAppStore";
import { shallow } from 'zustand/shallow';

export default function FundsCard() {
    const {
        totalAmount,
        releasedAmount,
        tokenTicker,
        startTimestamp,
        endTimestamp,
        isLoading,
        updateContractData
    } = useAppStore(
        state => ({
            totalAmount: state.totalAmount,
            releasedAmount: state.releasedAmount,
            tokenTicker: state.tokenTicker,
            startTimestamp: state.startTimestamp,
            endTimestamp: state.endTimestamp,
            isLoading: state.isLoading,
            updateContractData: state.updateContractData
        }),
        shallow
    );

    return (
        <Card className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <h3 className="font-bold">Escrow Funds</h3>
                <RefreshButton onClick={updateContractData} isLoading={isLoading} />
            </div>

            <InfoRow
                label="Total Funds In Escrow:"
                value={`${totalAmount || "0"} ${tokenTicker}`}
                loading={isLoading}
            />
            <InfoRow
                label="Released amount:"
                value={`${releasedAmount || "0"} ${tokenTicker}`}
                loading={isLoading}
            />

            <div className="text-sm space-y-1 border p-3 rounded-md bg-muted/30">
                <div className="font-semibold">Info</div>

                <InfoRow
                    label="Start Date:"
                    value={startTimestamp ? formatDate(new Date(startTimestamp)) : "-"}
                    loading={isLoading}
                />
                <InfoRow
                    label="End Date:"
                    value={endTimestamp ? formatDate(new Date(endTimestamp)) : "-"}
                    loading={isLoading}
                />
                <InfoRow
                    label="Duration:"
                    value={
                        startTimestamp && endTimestamp
                            ? calculateDuration(startTimestamp, endTimestamp)
                            : "-"
                    }
                    loading={isLoading}
                />
            </div>
        </Card>
    );
}