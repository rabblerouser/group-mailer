const { reducer: admins, getEmails } = require('../admins');

describe('admins reducer', () => {
  it('has no admins by default', () => {
    expect(admins(undefined, {})).to.eql([]);
  });

  it('preserves existing state for uninteresting actions', () => {
    expect(admins([{ id: 'blah' }], { type: 'NOT_INTERESTING' })).to.eql([{ id: 'blah' }]);
  });

  it('creates an admin', () => {
    const state = [{ id: 'existing-admin', email: 'existing@example.com' }];
    const action = { type: 'CREATE_ADMIN', admin: { id: 'new-admin', email: 'new@example.com', name: 'Me' } };
    expect(admins(state, action)).to.eql([
      { id: 'existing-admin', email: 'existing@example.com' },
      { id: 'new-admin', email: 'new@example.com' },
    ]);
  });

  it('deletes an admin', () => {
    const event = { type: 'REMOVE_ADMIN', admin: { id: 'delete-me' } };
    const state = [{ id: 'delete-me', email: 'delete@example.com' }, { id: 'keep-me', email: 'keep@example.com' }];
    expect(admins(state, event)).to.eql([{ id: 'keep-me', email: 'keep@example.com' }]);
  });

  it('edits an admin', () => {
    const event = {
      type: 'EDIT_ADMIN',
      admin: { id: 'updated-admin', email: 'updated@example.com', name: 'Updated Member' },
    };
    const state = [
      { id: 'updated-admin', email: 'old@example.com' },
      { id: 'unchanged-admin', email: 'unchanged@example.com' },
    ];
    expect(admins(state, event)).to.eql([
      { id: 'updated-admin', email: 'updated@example.com' },
      { id: 'unchanged-admin', email: 'unchanged@example.com' },
    ]);
  });
});

describe('getEmails', () => {
  it('extracts emails from the admin data', () => {
    const adminData = [{ id: 'first', email: 'first@example.com' }, { id: 'second', email: 'second@example.com' }];

    expect(getEmails(adminData)).to.eql(['first@example.com', 'second@example.com']);
  });
});
