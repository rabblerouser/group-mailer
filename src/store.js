const redux = require('redux');
const members = require('./reducers/members');

const rootReducer = redux.combineReducers({ members: members.reducer });

const store = redux.createStore(rootReducer);

// stream-client needs us to return promises from our event handlers
const dispatch = (action) => {
  try {
    store.dispatch(action);
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
};

module.exports = {
  getMemberEmails: () => members.getEmails(store.getState().members),

  registerMember: member => dispatch({ type: 'REGISTER_MEMBER', member }),
  removeMember: member => dispatch({ type: 'REMOVE_MEMBER', member }),
  editMember: member => dispatch({ type: 'EDIT_MEMBER', member }),
};
