const redux = require('redux');
const members = require('./reducers/members');

const rootReducer = redux.combineReducers({ members });

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
  getMembers: () => store.getState().members,
  createMember: member => dispatch({ type: 'CREATE_MEMBER', member }),
  deleteMember: member => dispatch({ type: 'DELETE_MEMBER', member }),
  updateMember: member => dispatch({ type: 'UPDATE_MEMBER', member }),
};
