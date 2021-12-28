import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export async function handle({ request: req, resolve }) {
  const token = (req.headers.authorization || '').replace('Bearer: ', '');

  if (!token) {
    req.locals.auth = false;
    return await resolve(req);
  }

  try {
    const { data: { userId } } = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER
    });

    req.locals = { auth: true, userId }
  } catch (error) {
    console.log('jwt error: ', error);
    req.locals.auth = false;
  }

  return await resolve(req);
}