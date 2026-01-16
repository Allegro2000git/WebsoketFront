import { type ChangeEvent, type Dispatch, type KeyboardEvent, type SetStateAction, useRef, useState } from 'react'
import s from './MessageInput.module.css'
import {useAppSelector} from "../../../../common/hooks/useAppSelector";
import {
    selectConnectionStatus,
    selectReadyToSendMessagesStatus,
    sendClientMessage, stopTypingMessage,
    typeMessage
} from "../../model/chatSlice";
import {useAppDispatch} from "../../../../common/hooks/useAppDispatch";
import arrow from "../../../../assets/arrow.svg";

type MessageInputProps = {
    setIsAutoScrollActive: Dispatch<SetStateAction<boolean>>
    isScrolling: boolean
}

export const MessageInput = ({ setIsAutoScrollActive, isScrolling }: MessageInputProps) => {
    const connectionStatus = useAppSelector(selectConnectionStatus)
    const readyToSendMessagesStatus = useAppSelector(selectReadyToSendMessagesStatus)
    const isConnected = connectionStatus === 'online' && readyToSendMessagesStatus

    const [message, setMessage] = useState<string>('')
    const dispatch = useAppDispatch()
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const resizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
        }
    }

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newMessage = e.currentTarget.value
        setMessage(newMessage)

        resizeTextarea()

        if (/\S/.test(newMessage)) {
            dispatch(typeMessage())
        } else {
            dispatch(stopTypingMessage())
        }
    }

    const handleSendMessage = (message: string) => {
        dispatch(sendClientMessage(message));
        setIsAutoScrollActive(true)
    }

    const handleSendClick = () => {
        if (message.trim() === '') return
        handleSendMessage(message.trim())
        dispatch(stopTypingMessage())
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
        setMessage('')
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) return

            e.preventDefault()

            if (e.ctrlKey) {
                handleSendClick()
            } else if (e.key.length === 1) {
                dispatch(typeMessage())
            }
        }
    }

    return (
        <section className={`${s.inputSection} ${!isScrolling ? s.onScroll : ''}`}>
            <div className={s.inputContainer}>
                <div className={s.inputGroup}>
                    <div className={s.inputWrapper}>
            <textarea
                ref={textareaRef}
                className={s.inputMessage}
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={!isConnected}
                placeholder={!isConnected ? 'There is no connection to the server' : 'Message'}
                rows={1}
            />
                        <svg width='9' height='20' className={`${s.ownAppendix} ${s.inputAppendix}`}>
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
                    </div>
                    <button className={s.sendButton} onClick={handleSendClick} disabled={!isConnected}>
                        <img className={s.sendButtonIcon} src={arrow} alt='Send icon' />
                    </button>
                </div>
            </div>
        </section>
    )
}