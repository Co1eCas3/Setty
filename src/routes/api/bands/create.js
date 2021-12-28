import { responses } from "$lib/utils/responses";
import db from '$lib/database/dbConnect';
import userView from '$lib/database/views/user';
import bandUserView from '$lib/database/views/bandUser';
import bandView from "$lib/database/views/band";

export async function post(req) {
  if (!req.locals.auth) return responses.forbidden({});
  const incoming = JSON.parse(req.body, forceRolesToInt);

  // create the band
  // find invitee ids
  // create new users if needed
  // add banduser assocs w roles

  try {
    const newBand = await db.band.create({
      select: {
        ...bandView,
        users: true
      },
      data: {
        name: incoming.band.name,
        webSafeName: incoming.band.webSafeName,
        users: {
          create: [
            {
              userRole: incoming.userRole,
              bandRole: incoming.bandRole,
              otherBandRoleDescription: incoming.otherBandRoleDescription,
              user: {
                connect: { id: req.locals.userId }
              }
            }
          ].concat(incoming.band.users.map(invitee => ({
            userRole: invitee.userRole,
            bandRole: invitee.bandRole,
            otherBandRoleDescription: invitee.otherBandRoleDescription,
            user: {
              connectOrCreate: {
                where: { email: invitee.email },
                create: { email: invitee.email }
              }
            }
          })))
        }
      }
    });

    return responses.success({ band: newBand });
  } catch (error) {
    console.log(error);
    return responses.serverError({ error: error.toString() });
  }
}

function forceRolesToInt(key, value) {
  if (['userRole', 'bandRole'].includes(key)) {
    if (typeof value !== 'number') return parseInt(value);
  }
  return value;
}