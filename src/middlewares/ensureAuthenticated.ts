import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface IPayload {
    sub: string;
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    
    const authToken = request.headers.authorization;

    if(!authToken) {
        return response.status(401).json({ message: 'Token not provided' });
    }

    const token = authToken.split(' ')[1];
    
    try {
        const { sub } = verify(token, "secret-token") as IPayload;

        request.user_id = sub;

    } catch (err) {
        return response.status(401).json({ message: 'Invalid token' });
    }

    return next();
}