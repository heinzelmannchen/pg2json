var chai = require('chai'),
    should = chai.Should();
chai.should();
require('mocha-as-promised')();

chai.use(require('sinon-chai'));
chai.use(require('chai-fuzzy'));
chai.use(require('chai-as-promised'));
