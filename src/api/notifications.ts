import { axiosApi } from './axiosApi.ts';
import type { NotificationResponse } from './types/notificationTypes.ts';

export const fetchNotifications = async (params: URLSearchParams): Promise<NotificationResponse> => {
  const response = await axiosApi.get<NotificationResponse>(`v1/notifications/?${params}`);
  return response.data;
}