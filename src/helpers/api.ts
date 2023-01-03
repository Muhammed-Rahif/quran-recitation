import { QuranApiInstance } from "../constants/api";
import { QuranChapter } from "../types/QuranChapter";

export function getAllChapters(): Promise<QuranChapter[]> {
  return new Promise((resolve, reject) => {
    QuranApiInstance.get("/chapters?language=en")
      .then(response => {
        resolve(response.data?.chapters);
      })
      .catch(reject);
  });
}

export function getRecitationForChapter({
  recitationId,
  chapterNo,
}: {
  recitationId: number;
  chapterNo: number;
}): Promise<[]> {
  return new Promise((resolve, reject) => {
    QuranApiInstance.get(`/recitations/${recitationId}/by_chapter/${chapterNo}?language=en`)
      .then(response => {
        resolve(response.data);
      })
      .catch(reject);
  });
}
