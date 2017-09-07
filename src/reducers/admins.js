const defaultState = [];

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'CREATE_ADMIN':
      return state.concat({ id: action.admin.id, email: action.admin.email });
    case 'REMOVE_ADMIN':
      return state.filter(admin => admin.id !== action.admin.id);
    case 'EDIT_ADMIN':
      return state.map(admin => (
        admin.id === action.admin.id ?
          { id: action.admin.id, email: action.admin.email } :
          admin
      ));
    default:
      return state;
  }
};

const getEmails = admins => admins.map(admin => admin.email);

module.exports = {
  reducer,
  getEmails,
};
