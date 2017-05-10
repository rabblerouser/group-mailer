'use strict';
const service = require('../src/service');

describe('service', () => {
  it('should return the body of the request', () => {
    let req = {
      body: {
        name: 'Jules'
      }
    };

    let result = service.processNewEmail(req);
    expect(result).to.deep.equal({ name: 'Jules'});

  });
});
