import {useState, type ChangeEvent, type KeyboardEvent} from "react";
import s from "./Header.module.css"

type Props = {
    userName: string
    setChatUserName: (name: string) => void
};

export const Header = ({userName, setChatUserName}: Props) => {
    const [name, setName] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>)=> {
        if (error) {
            setError(null)
        }
        setName(e.currentTarget.value)
    }

    const handleConfirm = ()=> {
        const trimmedName = name.trim()

        if (!trimmedName || trimmedName === "") {
            setError('Need correct name')
            return
        }

        setIsEditing(false)


        localStorage.setItem("userName", trimmedName)
        setChatUserName(trimmedName)
        setName('')
        setError(null)

    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>)=> {
        if (e.key === "Enter") handleConfirm()
    }

    const handleSpanOnClick = () => setIsEditing(true)

    return (
        <header className={s.header}>
            <div className={s.container}>
                <div className={s.content}>
                    <div className={s.name}>
                        Your name: {" "}
                        {isEditing ? (
                                <div className={s.inputWrapper}>
                                    <input value={name}
                                           className={error ? s.inputError : ''}
                                           onChange={handleOnChange}
                                           onBlur={handleConfirm}
                                           onKeyDown={handleKeyDown}
                                           maxLength={15}
                                           autoFocus/>
                                    {error && <div className={s.errorText}>{error}</div>}
                                </div>
                            ) : (
                            <span onClick={handleSpanOnClick}>
                                {userName}
                            </span>
                        )}
                    </div>
                    <>Status Server</>
                </div>
            </div>
        </header>
    )
};