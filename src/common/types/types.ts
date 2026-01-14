export type User = {
    id: string
    name: string
}

export type Message = {
    id: string
    message: string
    createdAt: string
    user: User
}

export type ServerStatusType = 'online' | 'offline' | 'connecting'

export type ChatState = {
    messages: Message[]
    connectionStatus: ServerStatusType
}