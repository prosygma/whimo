import { axiosApi } from './axiosApi.ts';
import type { AnalyticsSummaryResponse } from './types/analyticsTypes.ts';

export const fetchAnalyticsSummary = async (): Promise<AnalyticsSummaryResponse> => {
  const response = await axiosApi.get<AnalyticsSummaryResponse>('v1/analytics/user/');
  return response.data;
};
