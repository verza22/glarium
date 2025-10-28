export interface RequestUserConfig {
    id: number
}

export interface RequestUserLogin {
    email: string,
    password: string
}

export interface RequestUserRegister {
    name: string,
    email: string,
    password: string
}

export interface RequestUserGetMayor {
    page: number
}

export interface RequestUserGetMessages {
    page: number,
    type: number
}

export interface RequestUserSendMessage {
    cityFromId: number,
    message: string,
    cityId: number
}

export interface RequestUserReadMessage {
    messageId: number
}

export interface RequestUserUnreadOrReadAll {
    readed: boolean
}

export interface RequestUserDeleteMessages {
    messages: number[],
    type: boolean
}