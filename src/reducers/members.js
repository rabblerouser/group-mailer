const defaultState = [];

const members = (state = defaultState, action) => {
  switch (action.type) {
    case 'CREATE_MEMBER':
      return state.concat(action.member);
    default:
      return state;
  }
};

module.exports = members;
