import { GET_CHAPTERS_ENDPOINT, QuranApiInstance } from "../constants/api";
import { QuranChapter } from "../types/QuranChapter";

export function getAllChapters(): Promise<QuranChapter[]> {
  return new Promise((resolve, reject) => {
    QuranApiInstance.get(GET_CHAPTERS_ENDPOINT)
      .then(response => {
        resolve(response.data?.chapters);
      })
      .catch(reject);
  });
}
