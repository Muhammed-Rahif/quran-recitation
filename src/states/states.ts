import { atom } from "jotai";
import WaveSurfer from "wavesurfer.js";

type ActiveAudioDataStateType = {
  wavesurfer?: WaveSurfer;
  chapterNo?: number;
} | null;

export const activeAudioDataState = atom<ActiveAudioDataStateType>({});
