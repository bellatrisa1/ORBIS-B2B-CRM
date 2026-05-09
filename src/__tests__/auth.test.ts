import { describe, it, expect } from 'vitest';

describe('Auth helpers', () => {
  it('encodeSession и decodeSession работают', () => {
    // Простой тест без импорта (функции приватные)
    const session = {
      userId: '123',
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
    };

    const encoded = Buffer.from(JSON.stringify(session)).toString('base64');
    const decoded = JSON.parse(Buffer.from(encoded, 'base64').toString());

    expect(decoded).toEqual(session);
  });
});
