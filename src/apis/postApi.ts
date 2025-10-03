// services/postAPI.ts
import axiosClient from "./axiosClient";

class PostAPI {
    request = async (
        url: string,
        data?: any,
        method: "get" | "post" | "put" | "delete" = "get"
    ) => {
        const isFormData = data instanceof FormData;

        if (method === "get" || method === "delete") {
            return await axiosClient.request({
                url: `/post${url}`,
                method,
            });

        }

        return await axiosClient.request({
            url: `/post${url}`,
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

const postAPI = new PostAPI();
export default postAPI;
