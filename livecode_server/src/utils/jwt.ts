import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || '2X8xTIH743w4BAfkSxIBKmOMlRQu7FSM';

export const signJwt = (payload: Object, expiresIn: string | number) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyJwt = <T>(token: string): { payload: T | null, error: string | null } => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as T;
    return { payload, error: null };
  } catch (error) {
    console.log("token verify error",error);
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return { payload: null, error: 'TokenExpiredError' };
    } else {
      return { payload: null, error: 'InvalidTokenError' };
    }
  }
};