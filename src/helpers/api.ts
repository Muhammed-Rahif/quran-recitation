import { QuranApiInstance } from "../constants/api";
import { ChapterRecitations } from "../types/ChapterRecitations";
import { ChapterVerses } from "../types/ChapterVerses";
import { QuranChapter } from "../types/QuranChapter";
import { SurahAudio } from "../types/SurahAudio";

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
}): Promise<ChapterRecitations> {
  return new Promise((resolve, reject) => {
    QuranApiInstance.get(`/recitations/${recitationId}/by_chapter/${chapterNo}?language=en`)
      .then(response => {
        resolve(response.data);
      })
      .catch(reject);
  });
}

export function getChapterVerses({
  chapterNo,
}: {
  chapterNo: number;
}): Promise<ChapterVerses> {
  return new Promise((resolve, reject) => {
    QuranApiInstance.get(`/verses/by_chapter/${chapterNo}?language=en&fields=text_uthmani`)
      .then(response => {
        resolve(response.data);
      })
      .catch(reject);
  });
}

export function getSurahAudio({
  recitationId,
  chapterNo,
}: {
  recitationId: number;
  chapterNo: number;
}): Promise<SurahAudio> {
  return new Promise((resolve, reject) => {
    QuranApiInstance.get(`/chapter_recitations/${recitationId}/${chapterNo}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(reject);
  });
}
