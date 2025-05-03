export const calculateContractStatus = (depositExecuted, startTime, endTime, released, amount) => {
    let status = "Unknown";
    let statusMessage = "Contract status is unknown.";
    const now = Date.now();

    if (!depositExecuted) {
        status = "Not funded";
        statusMessage = "The contract has not received the required deposit.";
    } else if (startTime == 0) {
        status = "Not started";
        statusMessage = "The contract has been deployed but has not started yet.";
    } else if (now < Number(startTime) * 1000) {
        status = "Waiting";
        statusMessage = "The contract has not started yet.";
    } else if (now >= Number(startTime) * 1000 && now < Number(endTime) * 1000) {
        status = "Active";
        statusMessage = "The contract is currently active.";
    } else if (now >= Number(endTime) * 1000 && released < amount) {
        status = "Expired";
        statusMessage = "The contract has expired. You may reclaim your funds.";
    } else if (released >= amount) {
        status = "Completed";
        statusMessage = "The contract has been fully executed. All funds released.";
    }

    return {
        status,
        statusMessage,
        isContractActive: depositExecuted && startTime > 0,
        startTimestamp: Number(startTime) * 1000,
        endTimestamp: Number(endTime) * 1000
    };
};