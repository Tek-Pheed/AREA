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

export interface APIServices {
    name: string;
    connected: boolean;
    icon_url: string;
}

export interface ProfileData {
    Name: string;
    Email: string;
    ImgSrc: string;
}

export interface IAreaPair {
    actions_id: 0;
    email: string;
    id: string;
    reaction_id: 0;
}

export interface IModalFields {
    fieldID: string;
    fieldDescription: string;
    fieldType: string;
    fieldValue: string;
}

export interface IHeaderProperties {
    name: string;
    description: string,
    img_src: string;
}

export interface IModalVariables {
    name: string;
    img_src: string;
    value: string;
}