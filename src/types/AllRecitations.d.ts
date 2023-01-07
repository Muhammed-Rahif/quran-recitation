export interface AllRecitations {
    recitations: Recitation[];
}

export interface Recitation {
    id:              number;
    reciter_name:    string;
    style:           null | string;
    translated_name: TranslatedName;
}

export interface TranslatedName {
    name:          string;
    language_name: LanguageName;
}

export enum LanguageName {
    English = "english",
}
