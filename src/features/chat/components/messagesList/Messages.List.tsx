import type {Message} from "../../../../common/types/types";
import {socket} from "../../../../app/App";
import {type Dispatch, type SetStateAction, useEffect, useRef, useState} from "react";


type Props = {
    messages: Message[]
    message: string
    setMessage: (message: string) => void
    isAutoScrollActive: boolean
    setIsAutoScrollActive: Dispatch<SetStateAction<boolean>>
};
export const MessagesList = ({messages, message, setMessage, isAutoScrollActive, setIsAutoScrollActive}: Props) => {
    const [lastScrollTop, setLastScrollTop] = useState(0)
    const messagesBlock = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isAutoScrollActive) {
            messagesBlock.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isAutoScrollActive])

    return (
        <>
            <div style={{border: "1px solid brown", width: "600px", height: "400px", margin: "50px auto", overflowY: "scroll"}} onScroll={(e) => {
                const element = e.currentTarget
                let maxScrollPosition = element.scrollHeight - element.clientHeight
                if (element.scrollTop > lastScrollTop && Math.abs(maxScrollPosition - element.scrollTop) < 15) {

                    setIsAutoScrollActive(true)
                } else {
                    setIsAutoScrollActive(false)
                }
                setLastScrollTop(element.scrollTop)
            }}>
                {messages.map(el => (
                    <div key={el.id} style={{border: "1px solid orange", padding: "10px", background: "white", margin: "10px 0"}}>
                        <b>{el.user.name}: </b>{el.message}
                    </div>
                ))}
                <div ref={messagesBlock}></div>
            </div>
            <div style={{margin: "20px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "20px"}}>
                <textarea style={{width: "500px", height: "100px"}} value={message} onChange={(e) => setMessage(e.currentTarget.value)}></textarea>
                <button onClick={() => {
                    socket.emit("client-message-sent", message)
                    setMessage("")
                }}>Send</button>
            </div>
        </>
    );
};