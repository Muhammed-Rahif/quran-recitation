export interface SurahAudio {
  audio_file: AudioFile;
}

export interface AudioFile {
  id: number;
  chapter_id: number;
  file_size: number;
  format: string;
  audio_url: string;
}
