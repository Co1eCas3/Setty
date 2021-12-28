import jwt from 'jsonwebtoken';

import { responses } from "$lib/utils/responses";
import db from '$lib/database/dbConnect';
import userView from '$lib/database/views/user';

export async function post(req) {
  const { email, fbuid, newUser } = JSON.parse(req.body);

  if (!email || !fbuid) return responses.badRequest({});

  const userFindParams = (cond) => ({
    where: cond,
    select: userView
  });

  try {
    let user = await db.user.findUnique(userFindParams({ fbuid }));

    if (!user) {
      if (!newUser)
        throw new Error('A grievous error has occurred, please contact the site admin');

      user = await db.user.findUnique(userFindParams({ email }));

      if (!user)
        user = await db.user.create({ data: { email, fbuid }, select: userView });
    }

    const token = jwt.sign(
      { data: { userId: user.id } },
      process.env.JWT_SECRET,
      { issuer: process.env.JWT_ISSUER }
    );

    return responses.success({ user, token });
  } catch (error) {
    console.log('get user error: ', error);
    return responses.serverError({ error: error.toString() });
  }
}