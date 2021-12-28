import db from '$lib/database/dbConnect';
import { responses } from '$lib/utils/responses';
import userView from '$lib/database/views/user';

export async function put(req) {
  if (!req.locals.auth) return responses.forbidden({});

  const { userId: authedId } = req.locals;
  const { id: paramId } = req.params;
  if (authedId != paramId) return responses.conflict({});

  const { name } = JSON.parse(req.body);

  try {
    const updatedUser = await db.user.update({
      data: { name },
      where: { id: authedId },
      select: userView
    });

    return responses.success({ user: updatedUser });
  } catch (error) {
    console.log('update user error: ', error);
    return responses.serverError();
  }
}