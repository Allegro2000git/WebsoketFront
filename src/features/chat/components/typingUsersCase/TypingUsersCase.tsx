import s from './TypingUsersCase.module.css';
import {useAppSelector} from "../../../../common/hooks/useAppSelector";
import {selectTypingUsers} from "../../model/chatSlice";

export const TypingUsersCase = () => {
    const typingUsers = useAppSelector(selectTypingUsers)
    const count = typingUsers.length

    if (count === 0) return null

    let typingMessage: string

    switch (count) {
        case 1:
            typingMessage = `${typingUsers[0].name} is typing`
            break

        case 2:
            typingMessage = `${typingUsers[0].name} and ${typingUsers[1].name} are typing`
            break

        default:
            typingMessage = `${typingUsers[0].name} and ${count - 1} others are typing`
            break
    }

    return (
        <div className={s.typingIndicator}>
            {typingMessage}
            <span className={s.dots}>
        <span>...</span>
      </span>
        </div>
    )
}