import React, { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const ChatWiddget = props => {
  const [conn] = useState(() => {
    return io("http://localhost:3001");
  });

  const [messages, setMessages] = useState([]);
  const [currMessage, setCurrMessage] = useState([]);
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
    conn.emit("room", { roomId: 1 });
  }, []);

  const sendMessage = () => {
      currMessage &&
      conn.emit("send-message", { destinyRoom: 1, message: currMessage });

    setCurrMessage(curr => "");
  }

  return (
    <div className="chat-widdget">
      {messages.map((msg, ind) => (
        <span key={ind}> {msg.message} </span>
      ))}
      <div>
        <input
          style={{ marginTop: "auto" }}
          onChange={ev => setCurrMessage(ev.target.value)}
        ></input>
        <button onClick={ev => sendMessage()}>OK</button>
      </div>
    </div>
  );
};

function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="App">
      <div className="App">
        {chatOpen && <ChatWiddget />}
        <div className="chat-container">
          <div
            className="chat-btn"
            onClick={() => setChatOpen(val => !val)}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default App;
