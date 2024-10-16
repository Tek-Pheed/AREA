import { Request, Response, NextFunction } from 'express';

// Middleware to ensure user is authenticated
export function isAuthenticatedTwitch(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/api/oauth/twitch/login');
}

export function isAuthenticatedSpotify(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/api/oauth/spotify/login');
}

export function isAuthenticatedDiscord(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/api/oauth/discord/login');
}

export function isAuthenticatedGithub(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/api/oauth/discord/login');
}

export function isAuthenticatedGoogle(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/api/oauth/google/login');
}
