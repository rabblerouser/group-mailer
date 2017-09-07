const { reducer: members, getEmails } = require('../members');

describe('members reducer', () => {
  it('has no members by default', () => {
    expect(members(undefined, {})).to.eql([]);
  });

  it('preserves existing state for uninteresting actions', () => {
    expect(members([{ id: 'blah' }], { type: 'NOT_INTERESTING' })).to.eql([{ id: 'blah' }]);
  });

  it('creates a member', () => {
    const state = [{ id: 'existing-member', email: 'existing@example.com' }];
    const action = { type: 'REGISTER_MEMBER', member: { id: 'new-member', email: 'new@example.com', name: 'Me' } };
    expect(members(state, action)).to.eql([
      { id: 'existing-member', email: 'existing@example.com' },
      { id: 'new-member', email: 'new@example.com' },
    ]);
  });

  it('deletes a member', () => {
    const event = { type: 'REMOVE_MEMBER', member: { id: 'delete-me' } };
    const state = [{ id: 'delete-me', email: 'delete@example.com' }, { id: 'keep-me', email: 'keep@example.com' }];
    expect(members(state, event)).to.eql([{ id: 'keep-me', email: 'keep@example.com' }]);
  });

  it('edits a member', () => {
    const event = {
      type: 'EDIT_MEMBER',
      member: { id: 'updated-member', email: 'updated@example.com', name: 'Updated Member' },
    };
    const state = [
      { id: 'updated-member', email: 'old@example.com' },
      { id: 'unchanged-member', email: 'unchanged@example.com' },
    ];
    expect(members(state, event)).to.eql([
      { id: 'updated-member', email: 'updated@example.com' },
      { id: 'unchanged-member', email: 'unchanged@example.com' },
    ]);
  });
});

describe('getEmails', () => {
  it('extracts emails from the member data', () => {
    const memberData = [{ id: 'first', email: 'first@example.com' }, { id: 'second', email: 'second@example.com' }];

    expect(getEmails(memberData)).to.eql(['first@example.com', 'second@example.com']);
  });
});
