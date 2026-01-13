import {useState} from "react";
import s from "./App.module.css";
import {Header} from "../features/chat/components/header/Header";
import {MessagesList} from "../features/chat/components/messagesList/Messages.List";
import type {Message} from "../common/types/types";

function App() {
    const [chatUserName, setChatUserName] = useState<string>(() => localStorage.getItem('userName') || 'anonymous')
    const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)

    const [messages, setMessages] = useState<Message[]>([
        {message: "Hello, Dmitry", id: "vrz123z", user: {id: "1221rt", name: "Viktor"}},
        {message: "Hello, Viktor", id: "vrz112t", user: {id: "1214rt", name: "Dmitry"}},
        {message: "How are you", id: "vrz145z", user: {id: "1221rt", name: "Viktor"}}
    ])


    return (
        <div className={s.appContainer}>
           <Header
                userName={chatUserName}
                setChatUserName={setChatUserName}
            />
            <MessagesList messages={messages} userName={chatUserName}/>
        </div>
    );
}

export default App;