const defaultState = [];

const members = (state = defaultState, action) => {
  switch (action.type) {
    case 'CREATE_MEMBER':
      return state.concat(action.member);
    case 'DELETE_MEMBER':
      return state.filter(member => member.id !== action.member.id);
    default:
      return state;
  }
};

module.exports = members;
