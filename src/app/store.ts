import { configureStore } from '@reduxjs/toolkit'
import {chatReducer, chatSlice} from "../features/chat/model/chatSlice";

export const store = configureStore({
    reducer: {
        [chatSlice.name]: chatReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch