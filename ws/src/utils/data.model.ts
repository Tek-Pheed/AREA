export interface IHeaders {
    'Content-Type': string;
}

export interface IBodySpecific {
    name: string;
    value: string;
}

export interface IBody {
    action: IBodySpecific[];
    reaction: IBodySpecific[];
}

export interface IUsersConfigs {
    id: number;
    email: string;
    actions_id: number;
    method: string;
    headers: IHeaders;
    body: IBody;
    reaction_id: number;
}
