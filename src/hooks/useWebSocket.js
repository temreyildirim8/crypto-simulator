import { useEffect, useRef, useState } from 'react';

const useWebSocket = (symbol) => {
  const [lastMessage, setLastMessage] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const wsSymbol = symbol.toLowerCase().replace('/', '');
    socketRef.current = new WebSocket(`wss://stream.binance.com:9443/ws/${wsSymbol}@ticker`);

    socketRef.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event?.data);
      setLastMessage(data);
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [symbol]);

  return { lastMessage };
};

export default useWebSocket;