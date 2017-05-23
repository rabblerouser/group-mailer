const sinon = require('sinon');
const chai = require('chai');

chai.use(require('sinon-chai'));
chai.should();

global.expect = chai.expect;
global.sinon = sinon;
global.chai = chai;
