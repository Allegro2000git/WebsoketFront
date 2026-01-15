import {useState} from "react";
import s from "./App.module.css";
import {Header} from "../features/chat/components/header/Header";
import {MessageList} from "../features/chat/components/messagesList/MessageList";
import {io} from "socket.io-client";
import {useSendClientName} from "../common/hooks/useSendClientName";
import {useChatConnection} from "../common/hooks/useChatConnection";
import {MessageInput} from "../features/chat/components/messageInput/MessageInput";

export const socket = io("http://localhost:3009")

function App() {
    const [chatUserName, setChatUserName] = useState<string>(() => localStorage.getItem('userName') || 'anonymous')
    const [isAutoScrollActive, setIsAutoScrollActive] = useState<boolean>(true)

    useChatConnection()
    useSendClientName(chatUserName)

    return (
        <div className={s.appContainer}>
           <Header
                userName={chatUserName}
                setChatUserName={setChatUserName}
            />
            <MessageList isAutoScrollActive={isAutoScrollActive} setIsAutoScrollActive={setIsAutoScrollActive} userName={chatUserName}/>
            <MessageInput isScrolling={isAutoScrollActive} setIsAutoScrollActive={setIsAutoScrollActive}/>
        </div>
    );
}

export default App;