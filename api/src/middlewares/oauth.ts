import { Request, Response, NextFunction, Express } from 'express';

// Middleware to ensure user is authenticated
export function ensureAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.session || !req.session.twitchToken) {
        return res.redirect('/auth/twitch');
    }
    next();
}
