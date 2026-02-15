function test(title, callback) {
  const root = document.getElementById('root')
  try {
    callback()
    root.append(`v ${title}`)
  } catch (error) {
    root.append(`x ${title}`)
    root.append(error)
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`${actual} is not equal to ${expected}`)
      }
    },
    toEqual(expected) {}
  }
}

test('number formatter', () => {
    const result = NumberFormatter({ value: 6.9, locale: 'en'})
    const expected = '6.9'
    expect(result).toBe(expected)
  })
