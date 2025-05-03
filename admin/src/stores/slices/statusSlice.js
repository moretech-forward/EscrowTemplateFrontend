// src/stores/slices/statusSlice.js

import { calculateContractStatus } from "../../utils/calculateContractStatus.js";

export const statusSlice = (set, get) => ({
    contractStatus: "",
    contractStatusMessage: "",
    isContractActive: false,
    startTimestamp: null,
    endTimestamp: null,

    // Вызывается после получения данных из контракта
    updateContractStatusFromContractData: (contractData) => {
        const {
            depositExecuted,
            startTime,
            endTime,
            amount,
            released
        } = contractData;

        const statusData = calculateContractStatus(
            depositExecuted,
            startTime,
            endTime,
            released,
            amount
        );

        set({
            contractStatus: statusData.status,
            contractStatusMessage: statusData.statusMessage,
            isContractActive: statusData.isContractActive,
            startTimestamp: statusData.startTimestamp,
            endTimestamp: statusData.endTimestamp,
        });
    },
});