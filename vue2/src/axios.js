import axios from 'axios';
import { Message } from 'element-ui';

axios.defaults.timeout = 20000;

axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.message.includes('timeout')) {
      Message({
        type: error,
        message: '服务连接超时...',
        center: true,
        duration: 10000,
      });
    } else {
      Message({
        type: error,
        message: '服务器连接失败...',
        center: true,
        duration: 10000,
      });
    }
    return Promise.reject(error);
  },
);

export default axios;
