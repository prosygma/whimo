import { axiosApi } from './axiosApi.ts';
import type { ApiResponse } from './types/common.ts';

export interface AppLanguage {
  code: string;
  /** Name in the language itself, for example "हिन्दी". */
  name: string;
  english_name: string;
  /** Optional flag emoji. */
  flag: string;
  /** Increases with each upload of strings in the admin. */
  version: number;
}

export interface LanguagesResponse {
  default: string | null;
  languages: AppLanguage[];
}

/** Languages enabled in the admin, in picker order. */
export const fetchLanguages = async (): Promise<LanguagesResponse> => {
  const response = await axiosApi.get<ApiResponse & { data: LanguagesResponse }>('v1/languages/');
  return response.data.data;
};

/** Web strings uploaded in the admin for a language, grouped by namespace. */
export const fetchUploadedStrings = async (code: string): Promise<Record<string, Record<string, string>>> => {
  const response = await axiosApi.get<ApiResponse & { data: { strings: Record<string, Record<string, string>> } }>(
    `v1/languages/${encodeURIComponent(code)}/web/`,
  );
  return response.data.data.strings;
};
