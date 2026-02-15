function test(title, callback) {
  try {
    callback()
    console.log(`v ${title}`)
  } catch (error) {
    console.log(`x ${title}`)
    console.log(error)
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
  const result = <NumberFormatter value="6.9" locale="pl" />
  const expected = '6.90'
  expect(result).toBe(expected)
})
