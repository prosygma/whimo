import z from 'zod';
import {
  NotificationItemSchema,
  NotificationsListSchema,
  NotificationResponseSchema,
} from '../schemas/notificationsSchema.ts';

export type NotificationItem = z.infer<typeof NotificationItemSchema>;
export type NotificationsList = z.infer<typeof NotificationsListSchema>;
export type NotificationResponse = z.infer<typeof NotificationResponseSchema>;
