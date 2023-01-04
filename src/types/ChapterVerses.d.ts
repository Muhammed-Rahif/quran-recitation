export interface ChapterVerses {
  verses: Verse[];
  pagination: Pagination;
}

export interface Pagination {
  per_page: number;
  current_page: number;
  next_page: null;
  total_pages: number;
  total_records: number;
}

export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: null;
  text_uthmani: string;
  page_number: number;
  juz_number: number;
}
