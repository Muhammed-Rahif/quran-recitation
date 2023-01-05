import { atom } from "jotai";
import WaveSurfer from "wavesurfer.js";

type ActiveAudioDataStateType = {
  wavesurfer?: WaveSurfer;
  chapterNo?: number;
  expandedPlayer: boolean;
} | null;

export const activeAudioDataState = atom<ActiveAudioDataStateType>({ expandedPlayer: true });
