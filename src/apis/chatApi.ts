import axiosClient from "./axiosClient";

class ChatAPI {
    request = async (
        url: string,
        data?: any,
        method: "get" | "post" | "put" | "delete" = "get"
    ) => {
        const isFormData = data instanceof FormData;

        if (method === "get" || method === "delete") {
            return await axiosClient.request({
                url: `/chat${url}`,
                method,
            });

        }

        return await axiosClient.request({
            url: `/chat${url}`,
            method,
            data,
            headers: {
                ...(isFormData
                    ? {}
                    : { "Content-Type": "application/json" }),
            },
        });
    };
}

const chatAPI = new ChatAPI();
export default chatAPI;
