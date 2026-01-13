import {useEffect, useState} from "react";
import s from "./App.module.css";
import {Header} from "../features/chat/components/header/Header";
import {MessagesList} from "../features/chat/components/messagesList/Messages.List";
import type {Message} from "../common/types/types";
import {io} from "socket.io-client";

export const socket = io("http://localhost:3009")

function App() {

    const [chatUserName, setChatUserName] = useState<string>(() => localStorage.getItem('userName') || 'anonymous')
    const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)
    const [messages, setMessages] = useState<Message[]>([])
    const [message, setMessage] = useState<string>("hey")

    useEffect(() => {
        if (chatUserName && chatUserName !== 'anonymous') {
            socket.emit("client-name-sent", chatUserName);
        }

        const handleInitMessages = (messages: Message[]) => {
            setMessages(messages);
        }
        const handleNewMessage = (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        }

        socket.on('init-messages-published', handleInitMessages);
        socket.on('new-message-sent', handleNewMessage);

        return () => {
            socket.off('init-messages-published', handleInitMessages);
            socket.off('new-message-sent', handleNewMessage);
        };
    }, [chatUserName]);

    return (
        <div className={s.appContainer}>
           <Header
                userName={chatUserName}
                setChatUserName={setChatUserName}
            />
            <MessagesList message={message} setMessage={setMessage} messages={messages}/>
        </div>
    );
}

export default App;