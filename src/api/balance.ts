import type { BalanceResponse } from './types/balanceTypes.ts';
import { axiosApi } from './axiosApi.ts';
import type { ApiResponse } from './types/common.ts';

export const fetchCommodityGroupBalance = async () => {
  const response = await axiosApi.get<ApiResponse & BalanceResponse>(`v1/commodities/groups/?page_size=100`);
  return response.data;
};
