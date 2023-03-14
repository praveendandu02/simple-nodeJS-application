const sayHello = require('../hello');

describe('sayHello', () => {
  it('returns the correct greeting', () => {
    const result = sayHello('John');
    expect(result).toEqual('Hello, John!');
  });
});
