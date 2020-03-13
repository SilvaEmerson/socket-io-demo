import React, { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

function App() {
  const [conn] = useState(() => {
    return io("http://$URL", {
        transports: ['websocket'],
    });
  });

  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState();

  useEffect(() => {
    conn.on("solicitation", data => {
      setMessages(currMessages => [...currMessages, data]);
    });

    conn.on("message-channel", (data, ackFn) => {
      console.log(data);
      ackFn && ackFn(true);
      setMessages(currMessages => [...currMessages, data]);
    });
  }, [conn]);

  useEffect(() => {
    conn.emit("room", { roomId: roomId });
  }, [roomId]);

  return (
    <div className="App">
      <input
        type="text"
        onChange={ev => {
          console.log(ev.target.value);
          setRoomId(ev.target.value);
        }}
      ></input>
      {messages.map((el, ind) => (
        <ul key={ind}>{el.message}</ul>
      ))}
    </div>
  );
}

export default App;
