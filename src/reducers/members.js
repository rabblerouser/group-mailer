const defaultState = [];

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'CREATE_MEMBER':
      return state.concat({ id: action.member.id, email: action.member.email });
    case 'DELETE_MEMBER':
      return state.filter(member => member.id !== action.member.id);
    case 'UPDATE_MEMBER':
      return state.map(member => (
        member.id === action.member.id ?
          { id: action.member.id, email: action.member.email } :
          member
      ));
    default:
      return state;
  }
};

const getEmails = members => members.map(member => member.email);

module.exports = {
  reducer,
  getEmails,
};
