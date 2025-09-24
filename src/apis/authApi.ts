// import axiosClient from "./axiosClient";

// class AuthAPI {
//   HandleAuthentication = async (
//     url: string,
//     data?: any,
//     method: "get" | "post" | "put" | "delete" = "get"
//   ) => {
//     if (method === "get" || method === "delete") {
//       return await axiosClient.request({
//         url: `/auth${url}`,
//         method,
//       });
//     }

//     return await axiosClient.request({
//       url: `/auth${url}`,
//       method,
//       data,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   };
// }

// const authenticationAPI = new AuthAPI();
// export default authenticationAPI;



import axiosClient from "./axiosClient";

class AuthAPI {
  HandleAuthentication = async (
    url: string,
    data?: any,
    method: "get" | "post" | "put" | "delete" = "get"
  ) => {
    const isFormData = data instanceof FormData;

    if (method === "get" || method === "delete") {
      return await axiosClient.request({
        url: `/auth${url}`,
        method,
      });
    }

    return await axiosClient.request({
      url: `/auth${url}`,
      method,
      data,
      headers: {
        ...(isFormData
          ? {} // ❌ Không set content-type để Axios tự detect
          : { "Content-Type": "application/json" }),
      },
    });
  };
}

const authenticationAPI = new AuthAPI();
export default authenticationAPI;
