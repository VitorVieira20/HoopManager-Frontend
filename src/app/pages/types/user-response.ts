export type UserResponse = {
    id: string,
    name: string,
    email: string,
    role: string,
    plan: string,
    clubs?: string[],
    teams?: string[],
    games?: string[],
    players?: string[]
}

