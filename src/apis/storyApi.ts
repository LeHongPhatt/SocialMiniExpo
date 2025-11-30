// services/postAPI.ts
import axiosClient from "./axiosClient";

class storyApi {
    request = async (
        url: string,
        data?: any,
        method: "get" | "post" | "put" | "delete" = "get"
    ) => {
        const isFormData = data instanceof FormData;

        if (method === "get" || method === "delete") {
            return await axiosClient.request({
                url: `/story${url}`,
                method,
            });

        }

        return await axiosClient.request({
            url: `/story${url}`,
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

const storiesApi = new storyApi();
export default storiesApi;
