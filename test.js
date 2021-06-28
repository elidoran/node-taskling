'use strict'

const tap = require('tap')
const tasks  = require('./index.js')

tap.test('calls callback', function(t) {
  tasks({}, [], () => { t.end() })
})

tap.test('run a function', function(t) {
  let ran = false

  tasks({}, [
    function(next) {
      ran = true
      next()
    }
  ], function() {
    t.equal(ran, true, 'should run function')
    t.end()
  })
})

tap.test('run functions', function(t) {
  let ran = 0

  tasks({}, [
    function(next) {
      ran++
      next()
    },

    function(next) {
      ran++
      next()
    },

    function(next) {
      ran++
      next()
    },
  ], function() {
    t.equal(ran, 3, 'should run 3 functions')
    t.end()
  })
})

tap.test('shared object', function(t) {
  const object = {
    first: false,
    second: false,
    third: false
  }

  tasks(object, [
    function(next, context) {
      context.first = true
      next()
    },

    function(next, context) {
      context.second = true
      next()
    },

    function(next, context) {
      context.third = true
      next()
    },
  ], function() {
    t.equal(object.first, true)
    t.equal(object.second, true)
    t.equal(object.third, true)
    t.end()
  })
})

tap.test('deferred execution', function(t) {
  let started = false

  tasks({}, [
    function(next) {
      started = true
      next()
    }
  ], () => { t.end() })

  t.equal(started, false, 'should start async run later')
})

tap.test('error stops execution', function(t) {
  let ran = 0

  tasks({}, [
    function(next) {
      ran++
      next('error')
    },

    function(next) {
      ran++
      next()
    },
  ], function(error, result) {
    t.equal(error, 'error')
    t.same(result, null)
    t.equal(ran, 1, 'should only run first function')
    t.end()
  })
})

tap.test('prepend functions', function(t) {
  let ran = 0
  let soFar = null

  function fn(next) { ran++ ; next() }

  tasks({}, [
    function(next) {
      this.prepend([
        fn, fn, fn
      ])
      next()
    },

    function last(next) {
      soFar = ran
      next()
    }
  ], function() {
    t.equal(ran, 3, 'should run `fn` function 3 times')
    t.equal(soFar, 3, 'should run `last` after prepended functions')
    t.end()
  })
})

tap.test('append functions', function(t) {
  let ran = 0
  let soFar = null

  function fn(next) { ran++ ; next() }

  tasks({}, [
    function(next) {
      this.append([
        fn, fn, fn
      ])
      next()
    },

    function second(next) {
      soFar = ran
      next()
    }
  ], function() {
    t.equal(ran, 3, 'should run `fn` function 3 times')
    t.equal(soFar, 0, 'should run `second` before appended functions')
    t.end()
  })
})

tap.test('should clear remaining functions', function(t) {
  let ran = 0

  function fn(next) { ran++ ; next() }

  tasks({}, [
    function(next) {
      this.clear()
      next()
    },

    fn,
    fn,
    fn,
  ], function() {
    t.equal(ran, 0, 'should clear functions')
    t.end()
  })
})

tap.test('flatten array provided to prepend()', function(t) {
  let ran = 0

  function fn(next) { ran++ ; next() }

  tasks({}, [
    function(next) {
      this.prepend(
        [
          fn,
          [
            fn,
            [fn, fn],
            fn,
          ],
          fn,
          fn
        ]
      )
      next()
    },
  ], function() {
    t.equal(ran, 7, 'should call all three prepended functions')
    t.end()
  })
})

tap.test('should flatten array provided to append()', function(t) {
  let ran = 0

  function fn(next) { ran++ ; next() }

  tasks({}, [
    function(next) {
      this.append(
        [
          fn,
          [
            fn,
            [fn, fn],
            fn,
          ],
          fn,
          fn
        ]
      )
      next()
    },
  ], function() {
    t.equal(ran, 7, 'should call all three appended functions')
    t.end()
  })
})

tap.test('should use setImmediate', function(t) {
  let ran = 0

  function fn(next) { ran++ ; next() }

  tasks({}, [
    fn,
    fn,
    fn,
  ], function() {
    t.equal(ran, 3, 'should call function three times')
    t.end()
  }, setImmediate)
})

tap.test('should use custom executor', function(t) {
  let ran = 0

  function fn(next) { ran++ ; next() }

  function executor(fn) {
    setTimeout(fn, 100)
  }

  tasks({}, [
    fn,
    fn,
    fn,
  ], function() {
    t.equal(ran, 3, 'should call function three times')
    t.end()
  }, executor)
})
