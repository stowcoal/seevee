var expect = require('chai').expect;

describe('year', function() {
  it('should be 2017', function(){
    expect(new Date().getFullYear() === 2017);
  });
});
