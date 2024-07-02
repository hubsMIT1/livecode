import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';


interface AuthenticatedRequest extends Request {
  payload?: { userId: string, username: string, role: string };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  const { payload, error } = verifyJwt<{ userId: string, username: string, role: string }>(token);

  if (error === 'TokenExpiredError') { 
    return res.status(403).json({error: "TokenExpiredError", message: 'Unauthorized: Token has expired' });
  }
//403 just to again refresh auto

  if (error === 'InvalidTokenError' || !payload) {
    return res.status(401).json({error:"InvalidTokenError", message: 'Unauthorized: Invalid token' });
  }

  req.payload = payload;
  next();
};


export const isAdminOrStaff = async (req: Request, res: Response, next: NextFunction) => {
 
  const user = req.payload

  console.log(user)

  if (user && user.role!=='admin' && user.role !=='user')  // convert into staff
  {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
};