import { useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import Config from 'react-native-config';

let socket: Socket | undefined;

function useSocket(): [typeof socket, () => void] {
    const disconnect = useCallback(() => {
        if (socket) {
            socket.disconnect();
            socket = undefined;
        }
    }, [socket]);

    if (!socket) {
        socket = io(Config.API_URL ?? '', {
            transports: ['websocket'],
        });
    }

    return [socket, disconnect];
}

export default useSocket;
