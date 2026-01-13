import type {Message} from "../../../../common/types/types";
import {socket} from "../../../../app/App";


type Props = {
    messages: Message[]
    message: string
    setMessage: (message: string) => void
};
export const MessagesList = ({messages, message, setMessage}: Props) => {
    return (
        <div style={{border: "1px solid brown", width: "300px", height: "300px", margin: "50px auto", overflowY: "scroll"}}>
            {messages.map(el => (
                <div key={el.id} style={{border: "1px solid orange", padding: "10px", background: "white", margin: "10px 0"}}>
                    <b>{el.user.name}: </b>{el.message}
                </div>
            ))}
            <div style={{margin: "20px 0", display: "flex", alignItems: "center"}}>
                <textarea value={message} onChange={(e) => setMessage(e.currentTarget.value)}></textarea>
                <button onClick={() => {
                    socket.emit("client-message-sent", message)
                    setMessage("")
                }}>Send</button>
            </div>

        </div>
    );
};