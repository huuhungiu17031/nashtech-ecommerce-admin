import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const useNotification = (
    type: NotificationType,
    description: string = 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
) => {
    const api = notification.useNotification()[0];

    api[type]({
        message: 'Notification',
        description,
    });
};
