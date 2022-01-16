import bandUserView from "$lib/database/views/bandUser";

const userView = {
  id: true,
  name: true,
  email: true,
  bands: { select: bandUserView }
}

export default userView;