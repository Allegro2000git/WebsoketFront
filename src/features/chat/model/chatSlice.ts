import {createAppSlice} from "../../../common/utils/CreateAppSlice";
import type {ChatState, Message, ServerStatusType} from "../../../common/types/types";
import {chatApi} from "../api/api";


export const chatSlice = createAppSlice({
    name: 'chatSlice',
    initialState: {
        messages: [],
        connectionStatus: "offline" as ServerStatusType,
        readyToSendMessagesStatus: false,
        usersCount: 0,
    } as ChatState,
    selectors: {
        selectMessages: (s) => s.messages,
        selectConnectionStatus: (s) => s.connectionStatus,
        selectReadyToSendMessagesStatus: (s) => s.readyToSendMessagesStatus,
        selectUsersCount: (s) => s.usersCount,
    },
    reducers: (create) => ({
        messagesReceived: create.reducer<Message[]>((state, action) => {
            state.messages = action.payload
        }),
        newMessageReceived: create.reducer<Message>((state, action) => {
            const newMessage = action.payload
            if (state.messages.some(m => m.id !== newMessage.id)) {
              state.messages.push(newMessage)
            }
        }),
        setConnectionStatus: create.reducer<ServerStatusType>((state, action) => {
            state.connectionStatus = action.payload
        }),

        setReadyToSendMessages: create.reducer<boolean>((state, action) => {
            state.readyToSendMessagesStatus = action.payload
        }),
        usersCountUpdated: create.reducer<number>((state, action) => {
            state.usersCount = action.payload
        }),

        createConnection: create.asyncThunk(async (_, { dispatch }) => {
            dispatch(setConnectionStatus('connecting'))
            chatApi.createConnection()

            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
            chatApi.sendTimeZone(timeZone)

            chatApi.subscribe(
                (messages: Message[]) => {
                    dispatch(messagesReceived(messages))
                    dispatch(setReadyToSendMessages(true))
                },
                (newMessage: Message) => dispatch(newMessageReceived(newMessage)),
                (count: number) => dispatch(usersCountUpdated(count)),
            )

            chatApi.onConnect(() => {
                dispatch(setConnectionStatus('online'))
            })

            chatApi.onDisconnect(() => {
                dispatch(setConnectionStatus('offline'))
                dispatch(setReadyToSendMessages(false))
                dispatch(usersCountUpdated(0))
            })
        }),
        sendClientName: create.asyncThunk(async (name: string) => {
            chatApi.sendName(name)
        }),
        sendClientMessage: create.asyncThunk(async (message: string) => {
            chatApi.sendMessage(message)
        }),
        destroyConnection: create.asyncThunk(async (_, { dispatch }) => {
            chatApi.destroyConnection()
            dispatch(setConnectionStatus('offline'))
            dispatch(usersCountUpdated(0))
        }),
    }),
});

export const { messagesReceived, newMessageReceived, sendClientMessage, sendClientName, createConnection, destroyConnection, setConnectionStatus, setReadyToSendMessages, usersCountUpdated } = chatSlice.actions
export const {selectMessages, selectConnectionStatus, selectReadyToSendMessagesStatus, selectUsersCount } = chatSlice.selectors
export const chatReducer = chatSlice.reducer