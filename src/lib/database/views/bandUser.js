import bandView from '$lib/database/views/bandDetails';

const bandUserView = {
  userRole: true,
  bandRole: true,
  otherBandRoleDescription: true,
  band: {
    select: bandView
  }
};

export default bandUserView;