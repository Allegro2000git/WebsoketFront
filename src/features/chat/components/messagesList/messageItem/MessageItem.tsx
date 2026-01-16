import { useEffect, useRef, useState } from 'react'
import type {Message} from "../../../../../common/types/types";
import s from "./MessageItem.module.css"

type MessageItemPropsType = {
    message: Message
    currentName: string
}

export const MessageItem = ({ currentName, message }: MessageItemPropsType) => {
    const textRef = useRef<HTMLDivElement>(null)
    const [isSingleLine, setIsSingleLine] = useState(false)

    useEffect(() => {
        const el = textRef.current
        if (el) {
            const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '20')
            const height = el.offsetHeight
            setIsSingleLine(height <= lineHeight + 2)
        }
    }, [message.message])

    const isOwn = message.user.name === currentName

    return (
        <div className={`${s.messageItem} ${isOwn ? s.own : s.other}`}>
            <svg
                width='9'
                height='20'
                className={`${s.svgAppendix} ${isOwn ? s.ownAppendix : s.otherAppendix}`}
            >
                <g fill='none' fillRule='evenodd'>
                    <path
                        d='M3 17h6V0c-.193 2.84-.876 5.767-2.05 8.782-.904 2.325-2.446 4.485-4.625 6.48A1 1 0 003 17z'
                        fill='#000'
                    />
                    <path
                        d='M3 17h6V0c-.193 2.84-.876 5.767-2.05 8.782-.904 2.325-2.446 4.485-4.625 6.48A1 1 0 003 17z'
                        fill='FFF'
                    />
                </g>
            </svg>
            <b>{!isOwn && message.user.name}</b>
            <div className={`${s.messageTextWrapper} ${isSingleLine ? s.singleLine : ''}`}>
                <div ref={textRef} className={s.messageContent}>
                    {message.message}
                </div>
                <span className={s.messageTime}>
          {message.createdAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
            </div>
        </div>
    )
}