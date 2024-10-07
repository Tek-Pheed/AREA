export interface IUsers {
    email: string;
    password: string;
    username: string;
}

export interface IHeaders {
    'Content-Type': string;
}

export interface IBody {
    name: string;
    value: string;
}

export interface IUsersConfigs {
    id: number;
    email: string;
    action_id: number;
    method: string;
    headers: IHeaders;
    body: IBody[];
    reaction_id: number;
}
