export type TwitchTokenResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
}

export type Root = {
    total: number
    data: Daum[]
    max_total_cost: number
    total_cost: number
    pagination: Pagination
}

export type Daum = {
    id: string
    status: string
    type: string
    version: string
    condition: Condition
    created_at: string
    transport: Transport
    cost: number
}

export type Condition = {
    broadcaster_user_id: string
}

export type Transport = {
    method: string
    session_id: string
    connected_at: string
    disconnected_at: string
}
