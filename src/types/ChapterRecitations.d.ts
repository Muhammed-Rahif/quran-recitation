export interface ChapterRecitations {
  audio_files: AudioFile[];
  pagination: Pagination;
}

export interface AudioFile {
  verse_key: string;
  url: string;
}

export interface Pagination {
  per_page: number;
  current_page: number;
  next_page: null;
  total_pages: number;
  total_records: number;
}
