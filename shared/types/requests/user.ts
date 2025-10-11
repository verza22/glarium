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