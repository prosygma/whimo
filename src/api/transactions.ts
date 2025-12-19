import { axiosApi } from './axiosApi.ts';
import type {
  SingleTransactionResponse,
  TraceabilityCountsResponsePayload,
  TransactionItem,
  TransactionsResponse,
} from './types/transactionTypes.ts';
import type { ApiResponse } from './types/common.ts';
import type { AxiosResponse } from 'axios';

export const fetchTransactions = async (params: URLSearchParams): Promise<TransactionsResponse> => {
  const response = await axiosApi.get<ApiResponse & TransactionsResponse>(`v1/transactions/?${params}`);
  return response.data;
};

export const downloadBundle = async (id: string): Promise<AxiosResponse> => {
  return await axiosApi.get(`v1/transactions/${id}/download/bundle/`, {
    responseType: 'blob',
  });
};

export const downloadCsv = async (id: string): Promise<AxiosResponse> => {
  return await axiosApi.get(`v1/transactions/${id}/download/csv/`, {
    responseType: 'blob',
  });
};

export const fetchTraceabilityCounts = async (id: string): Promise<TraceabilityCountsResponsePayload> => {
  const response = await axiosApi.get<ApiResponse & { data: TraceabilityCountsResponsePayload }>(
    `v1/transactions/${id}/traceability-counts/`,
  );
  return response.data.data;
};

export const requestGeodata = async (id: string): Promise<ApiResponse> => {
  return await axiosApi.post(`v1/transactions/${id}/geodata/request/`);
};

export const fetchSingleTransaction = async (id: string): Promise<TransactionItem> => {
  const response = await axiosApi.get<SingleTransactionResponse>(`v1/transactions/${id}/`);
  return response.data.data;
};

export const downloadAll = async (params: URLSearchParams): Promise<AxiosResponse> => {
  return await axiosApi.get(`v1/transactions/download/csv/?${params}`, {
    responseType: 'blob',
  });
};
