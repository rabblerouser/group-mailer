const members = require('../../src/reducers/members');

describe('members reducer', () => {
  it('has no members by default', () => {
    expect(members(undefined, {})).to.eql([]);
  });

  it('creates a member', () => {
    const state = [{ id: 'existing-member' }];
    expect(members(state, { type: 'CREATE_MEMBER', member: { id: 'blah' } })).to.eql([
      { id: 'existing-member' },
      { id: 'blah' },
    ]);
  });

  it('preserves existing state for uninteresting actions', () => {
    expect(members([{ id: 'blah' }], { type: 'NOT_INTERESTING' })).to.eql([{ id: 'blah' }]);
  });
});
