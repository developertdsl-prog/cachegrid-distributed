import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'x-cache-key': 'cachegrid_sec_token_8892'
  }
});

export const fetchSummary = async () => {
  const res = await apiClient.get('/analytics/summary');
  return res.data;
};

export const fetchKey = async (key) => {
  const res = await apiClient.get(`/cache/${key}`);
  return res.data;
};

export const setKey = async (keyData) => {
  const res = await apiClient.post('/cache', keyData);
  return res.data;
};

export default apiClient;
