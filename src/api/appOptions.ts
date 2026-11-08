import { axiosApi } from './axiosApi.ts';
import type { ApiResponse } from './types/common.ts';

export type TraceabilityKey = 'full' | 'conditional' | 'partial' | 'incomplete';

export interface AppOptions {
  ask_on_plot: boolean;
  allow_gps_point: boolean;
  allow_cicc_qr: boolean;
  /** Explanation of each traceability status, built from the admin's traceability rules, in the request language. */
  traceability_descriptions?: Partial<Record<TraceabilityKey, string>>;
}

/** Geodata options and traceability explanations set in the admin (Settings). */
export const fetchAppOptions = async (): Promise<AppOptions> => {
  const response = await axiosApi.get<ApiResponse & { data: AppOptions }>('v1/app-options/');
  return response.data.data;
};
