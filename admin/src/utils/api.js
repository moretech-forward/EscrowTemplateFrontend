import axios from "axios";

const API_URL = "https://forwardfactory.ai/api/network/userwebapp/admin/";
const APP_ID = "f0c9012c-a7ec-4a00-a330-da2080a5658b";

export const fetchApiData = async () => {
    try {
        const { data } = await axios.get(`${API_URL}${APP_ID}`);
        return data;
    } catch (error) {
        console.error("Failed to fetch API data:", error);
        throw new Error("Failed to fetch application data");
    }
};