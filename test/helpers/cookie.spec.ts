import cookie from '../../src/helpers/cookie'

describe('helpers:cookie', () => {
  test('should get cookies', () => {
    document.cookie = 'foo=baz'
    expect(cookie.get('foo')).toBe('baz')
  })

  test('should return null if cookie name is not exist', () => {
    document.cookie = 'foo=baz'
    expect(cookie.get('bar')).toBeNull()
  })
})
