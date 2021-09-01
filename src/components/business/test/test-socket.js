import React from 'react';
import SockJsClient from 'react-stomp';

function TestSocket() {
  const [message, setMessage] = React.useState('');
  const handleMessage = (message) => {
    setMessage(message);
  };
  return (
    <div>
      <h1>Test socket:</h1>
      <p style={{ fontSize: '2rem' }}>{message}</p>
      <SockJsClient
        url={process.env.REACT_APP_BASE_URL + 'nxt-websocket'}
        topics={[`/ws-user/test`]}
        onMessage={(message) => handleMessage(message)}
      />
    </div>
  );
}

export default TestSocket;
