import { io, Socket } from 'socket.io-client'
import type {Message, User} from "../../../common/types/types";

const socket = 'http://localhost:3009'

export const EVENTS = {
    INIT_MESSAGES: 'init-messages-published',
    NEW_MESSAGE: 'new-message-sent',
    USER_TYPING: 'user-typing',
    USER_STOP_TYPING: 'user-stopped-typing',
    USERS_COUNT_UPDATING: 'users-count-updated',
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CLIENT_TIMEZONE_SENT: 'client-timezone-sent',
    CLIENT_NAME_SENT: 'client-name-sent',
    CLIENT_MESSAGE_SENT: 'client-message-sent',
    CLIENT_TYPED: 'client-typed',
    CLIENT_STOPPED_TYPING: 'client-stopped-typing',
} as const

export const chatApi = {
    socket: null as Socket | null,

    createConnection() {
        this.socket = io(socket, {
            reconnection: true,
            reconnectionDelay: 2000,
            reconnectionDelayMax: 10000,
            timeout: 20000,
        })
    },

    onConnect(onConnectHandler: () => void) {
        this.socket?.on(EVENTS.CONNECT, onConnectHandler)
    },

    sendTimeZone(timeZone: string) {
        this.socket?.emit(EVENTS.CLIENT_TIMEZONE_SENT, timeZone)
    },

    subscribe(
        initMessagesHandler: (messages: Message[]) => void,
        newMessageSentHandler: (newMessage: Message) => void,
        usersCountHandler: (count: number) => void,
        userTypingHandler: (user: User) => void,
        userStopTypingHandler: (user: User) => void,
    ) {
        this.socket?.on(EVENTS.INIT_MESSAGES, initMessagesHandler)
        this.socket?.on(EVENTS.NEW_MESSAGE, newMessageSentHandler)
        this.socket?.on(EVENTS.USER_TYPING, userTypingHandler)
        this.socket?.on(EVENTS.USER_STOP_TYPING, userStopTypingHandler)
        if (usersCountHandler) {
            this.socket?.on(EVENTS.USERS_COUNT_UPDATING, usersCountHandler)
        }
    },

    unsubscribe() {
        this.socket?.off(EVENTS.CONNECT)
        this.socket?.off(EVENTS.DISCONNECT)
        this.socket?.off(EVENTS.INIT_MESSAGES)
        this.socket?.off(EVENTS.NEW_MESSAGE)
        this.socket?.off(EVENTS.USER_TYPING)
        this.socket?.off(EVENTS.USER_STOP_TYPING)
        this.socket?.off(EVENTS.USERS_COUNT_UPDATING)
    },

    destroyConnection() {
        this.stopTyping()
        this.unsubscribe()
        this.socket?.disconnect()
        this.socket = null
    },

    onDisconnect(disconnectHandler: () => void) {
        this.socket?.on(EVENTS.DISCONNECT, disconnectHandler)
    },

    sendName(name: string) {
        this.socket?.emit(EVENTS.CLIENT_NAME_SENT, name)
    },

    sendMessage(message: string) {
        this.socket?.emit(EVENTS.CLIENT_MESSAGE_SENT, message)
    },

    typeMessage() {
        this.socket?.emit(EVENTS.CLIENT_TYPED)
    },

    stopTyping() {
        this.socket?.emit(EVENTS.CLIENT_STOPPED_TYPING)
    },
}