import { LocalStoreType } from "../types/LocalStoreType";

export const LOCAL_STORE_KEY = "quran-recitation-local-store";
export const defaultLocalStore: LocalStoreType = {
    lastReadChapterNo: 1,
    lastReadVerseNo: 1,
    reciterId: 5,
};