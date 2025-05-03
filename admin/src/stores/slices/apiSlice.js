import { fetchApiData } from "@/utils/api";

export const apiSlice = (set, get) => ({
    appData: null,
    isLoading: false,
    error: null,

    fetchDataFromAPI: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await fetchApiData();
            set({ appData: data, isLoading: false });
            return data;
        } catch (err) {
            const message = err.message || "Failed to load application data";
            set({ error: message, isLoading: false });
            get().showToast(message, "error");
            throw err;
        }
    },
});