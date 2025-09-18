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
    Authorization: accesstoken ? `Bearer ${accesstoken}` : '',
    Accept: 'application/json',
    ...config.headers,
  };

  config.data;
  return config;
});

axiosClient.interceptors.response.use(
  // res => { if (res.data && res.status === 200) return res.data; },
  res => {
    console.log("✅ API Response:", {
      status: res.status,
      data: res.data,
    });

    // Nhận tất cả status 2xx
    if (res.status >= 200 && res.status < 300) {
      return { ...res.data, status: res.status };

    }
    throw new Error(`Unexpected status code: ${res.status}`);
  },
  error => {
    console.log(`Error api ${JSON.stringify(error)}`);
    return Promise.reject(error);
    // throw new Error(error.response);
  },

);

export default axiosClient;
