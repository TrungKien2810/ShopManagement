import { useEffect, useState } from 'react';
// @ts-ignore
import * as signalR from '@microsoft/signalr';

export const useSignalR = (url: string, onConnected?: (connection: signalR.HubConnection) => void) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => {
          const userStr = localStorage.getItem("zoos_user");
          if (userStr) {
            const user = JSON.parse(userStr);
            return user.token;
          }
          return "";
        }
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
    
    return () => {
       newConnection.stop();
    };
  }, [url]);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log('SignalR Connected!');
          if (onConnected) onConnected(connection);
        })
        .catch((err: Error) => console.log('Connection failed: ', err));
    }
  }, [connection]);

  return connection;
};
