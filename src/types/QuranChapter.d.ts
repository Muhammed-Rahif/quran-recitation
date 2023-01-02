export interface QuranChapter {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_complex: string;
  name_arabic: string;
  name_simple: string;
  verses_count: number;
  pages: number[];
  translated_name: TranslatedName;
}

export interface TranslatedName {
  language_name: string;
  name: string;
}
