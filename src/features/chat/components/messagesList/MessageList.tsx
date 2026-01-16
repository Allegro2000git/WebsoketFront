import {type Dispatch, memo, type SetStateAction, type UIEvent, useCallback, useEffect, useRef} from "react";
import {useAppSelector} from "../../../../common/hooks/useAppSelector";
import {selectMessages} from "../../model/chatSlice";
import s from "./MessageList.module.css"
import {MessageItem} from "./messageItem/MessageItem";

type Props = {
    userName: string,
    isAutoScrollActive: boolean
    setIsAutoScrollActive: Dispatch<SetStateAction<boolean>>
};

export const MessageList = memo(({ userName, isAutoScrollActive, setIsAutoScrollActive}: Props) => {
    const messages = useAppSelector(selectMessages)
    const lastScrollTopRef = useRef(0)

    const messagesBlock = useRef<HTMLDivElement>(null)

    const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
        const element = e.currentTarget
        const maxScrollPosition = element.scrollHeight - element.clientHeight
        const scrollFromBottom = maxScrollPosition - element.scrollTop

        if (scrollFromBottom > 100) {
            setIsAutoScrollActive(false)
            lastScrollTopRef.current = element.scrollTop
            return
        }

        if (element.scrollTop > lastScrollTopRef.current && Math.abs(maxScrollPosition - element.scrollTop) < 10) {
            setIsAutoScrollActive(true)
        } else {
            setIsAutoScrollActive(false)
        }
        lastScrollTopRef.current = element.scrollTop
    }, [setIsAutoScrollActive])


    useEffect(() => {
        if (isAutoScrollActive) {
            messagesBlock.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isAutoScrollActive])

    return (
        <div className={s.messagesContainer} onScroll={handleScroll}>
            <div className={s.messagesWrapper}>
                {messages.map((m) => (
                    <MessageItem key={m.id} currentName={userName} message={m} />
                ))}
                <div ref={messagesBlock}></div>
            </div>
        </div>
    )
})