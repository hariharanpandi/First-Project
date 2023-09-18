import axios, { AxiosRequestConfig } from 'axios';

const API = (config: AxiosRequestConfig) => axios(config);

export default API;
