import { Request, Response, NextFunction, Express } from 'express';

// Middleware to ensure user is authenticated
export function isAuthenticatedTwitch(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/twitch');
}

export function isAuthenticatedSpotify(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/spotify');
}
