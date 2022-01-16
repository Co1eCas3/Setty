import { responses } from "$lib/utils/responses";
import db from '$lib/database/dbConnect';


export async function get(req) {
  const subject = req.url.searchParams.get('wsn');
  if (!subject) return responses.noContent({});

  try {
    const found = await db.band.findUnique({
      where: { webSafeName: subject },
      select: { webSafeName: true }
    });

    // todo: generate suggestions

    return found
      ? responses.success({ found: found.webSafeName })
      : responses.noContent({});
  } catch (error) {
    console.log(error);
    return responses.serverError(error.toString());
  }
}