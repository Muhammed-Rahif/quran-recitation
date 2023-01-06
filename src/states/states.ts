import { atom } from "jotai";

type ActiveAudioDataStateType = {
  chapterNo?: number;
  expandedPlayer: boolean;
} | null;

export const activeAudioDataState = atom<ActiveAudioDataStateType>({ expandedPlayer: true });
