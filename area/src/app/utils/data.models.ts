export interface Authentification {
    acces_token: string;
};

export interface Actions {
    data: any 
}

export interface Data {
    id: number;
    title: string;
    description: string;
    api_name: string;
    ask_url: string;
}

export interface UserData {
    id: number;
    email: string;
    username: string;
    create_at: any;
}
