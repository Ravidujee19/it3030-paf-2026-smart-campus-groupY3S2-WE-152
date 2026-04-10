import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useNotificationSocket(userEmail, onNotification) {
  const clientRef = useRef(null);

  useEffect(() => {
    if (!userEmail) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        // Subscribe to the user-specific notification queue
        client.subscribe(`/user/${userEmail}/queue/notifications`, (message) => {
          try {
            const notification = JSON.parse(message.body);
            onNotification(notification);
          } catch (e) {
            console.error('Failed to parse notification:', e);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [userEmail]); // Re-connect if user changes
}
