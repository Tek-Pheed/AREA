// types/express-session.d.ts
import 'express-session';

declare module 'express-session' {
    interface SessionData {
        twitchToken?: string;
        userInfo?: any; // Adjust type as needed
    }
}
