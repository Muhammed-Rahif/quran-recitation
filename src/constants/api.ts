import axios from "axios";

export const API_BASE_URL = "https://api.quran.com/api/v4";

export const GET_CHAPTERS_ENDPOINT = `${API_BASE_URL}/chapters?language=en`;

export const QuranApiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
