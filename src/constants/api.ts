import axios from "axios";

export const API_BASE_URL = "https://api.quran.com/api/v4/";
export const VERSUS_BASE_URL = "https://audio.qurancdn.com/";

export const QuranApiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
