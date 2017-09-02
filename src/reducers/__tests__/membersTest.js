const members = require('../members');

describe('members reducer', () => {
  it('has no members by default', () => {
    expect(members(undefined, {})).to.eql([]);
  });

  it('preserves existing state for uninteresting actions', () => {
    expect(members([{ id: 'blah' }], { type: 'NOT_INTERESTING' })).to.eql([{ id: 'blah' }]);
  });

  it('creates a member', () => {
    const state = [{ id: 'existing-member' }];
    expect(members(state, { type: 'CREATE_MEMBER', member: { id: 'blah' } })).to.eql([
      { id: 'existing-member' },
      { id: 'blah' },
    ]);
  });

  it('deletes a member', () => {
    const event = { type: 'DELETE_MEMBER', member: { id: 'existing-member' } };
    const state = [{ id: 'existing-member' }, { id: 'preserved-member' }];
    expect(members(state, event)).to.eql([{ id: 'preserved-member' }]);
  });

  it('edits a member', () => {
    const event = {
      type: 'UPDATE_MEMBER',
      member: { id: 'existing-member', email: 'new@email.com' },
    };
    const state = [
      { id: 'existing-member', email: 'old@email.com', name: 'Person McPersonface' },
      { id: 'preserved-member' },
    ];
    expect(members(state, event)).to.eql([
      { id: 'existing-member', email: 'new@email.com', name: 'Person McPersonface' },
      { id: 'preserved-member' },
    ]);
  });
});
