export interface IAuthentification {
    acces_token: string;
}

export interface IActions {
    id: number;
    title: string;
    description: string;
    api_name: string;
    ask_url: string;
}

export interface IReactions {
    id: number;
    title: string;
    description: string;
    api_name: string;
    ask_url: string;
}

export interface IApi {
    id: number;
    name: string;
    icon_url: string;
}

export interface IUsers {
    id: number;
    username: string;
    email: string;
    create_at: Date;
}
