import axios from 'axios';
import queryString from 'query-string';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appInfo } from '../constants/appInfors';

const getAccessToken = async () => {
  const res = await AsyncStorage.getItem('auth');
  return res ? JSON.parse(res).accesstoken : '';
};

const axiosClient = axios.create({
  baseURL: appInfo.BASE_URL,
  paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config: any) => {
  const accesstoken = await getAccessToken();

  config.headers = {
    Accept: 'application/json',
    ...config.headers,
  };

  if (accesstoken) {
    config.headers.Authorization = `Bearer ${accesstoken}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  res => {
    console.log("✅ API Response:", { status: res.status, data: res.data });

    if (res.status >= 200 && res.status < 300) {
      return { ...(res.data || {}), status: res.status };
    }
    throw new Error(`Unexpected status code: ${res.status}`);
  },
  async error => {
    console.log("❌ API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("auth");
      console.warn("🔑 Token hết hạn. Đã xóa khỏi AsyncStorage.");
      // TODO: điều hướng về màn hình login hoặc dispatch logout Redux
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
