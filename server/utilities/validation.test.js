const expect = require('expect');
const { isRealString } = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    var res = isRealString(90);
    expect(res).toBe(false);
  });

  it('should reject a string with only spaces', () => {
    var res = isRealString('   ');
    expect(res).toBe(false);
  });

  it('should allow string with non-space and space characters', () => {
    var res = isRealString('  your-string-with spaces ');
    expect(res).toBe(true);
  });
});
