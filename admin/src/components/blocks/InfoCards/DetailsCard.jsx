import { Card } from "pixel-retroui";
import CopyField from "@/components/ui/CopyableInput.jsx";
import { useAppStore } from "@/stores/useAppStore";

export default function DetailsCard() {
    const {
        appData,
        tokenAddress,
        isLoading,
        contractStatusMessage
    } = useAppStore();

    const getStatusColor = (message) => {
        if (!message) return "text-gray-500";
        if (message.includes("expired") || message.includes("refund")) return "text-red-500";
        if (message.includes("active")) return "text-green-500";
        if (message.includes("not started")) return "text-yellow-500";
        return "text-gray-700";
    };

    const statusColor = getStatusColor(contractStatusMessage);

    return (
        <Card className="flex flex-col gap-3 p-4">
            <h3 className="font-bold text-lg">Contract Details</h3>

            <CopyField
                label="Escrow Contract:"
                value={isLoading ? "Loading..." : appData?.contractAddress}
                loading={isLoading}
            />
            <CopyField
                label="Token Address:"
                value={isLoading ? "Loading..." : tokenAddress}
                loading={isLoading}
            />

            {/* Status */}
            <div className="mt-2 p-3 rounded-md bg-muted/30 border">
                <p className="text-sm font-semibold">Status:</p>
                <p className={`mt-1 font-medium ${statusColor}`}>
                    {isLoading ? "Loading..." : contractStatusMessage || "Unknown"}
                </p>
            </div>
        </Card>
    );
}