import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export const useSignalR = (url: string, onConnected?: (connection: signalR.HubConnection) => void) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(url)
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
