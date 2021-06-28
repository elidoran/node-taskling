'use strict'

const tap = require('tap')
const tasks  = require('./index.js')

tap.test('calls callback', function(t) {
  tasks({}, [next => { next() }], () => { t.end() })
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
  let
    ran = [],
    soFar = null
    ; // end of let list.

  function fn1(next) { ran.push(1) ; next() }
  function fn2(next) { ran.push(2) ; next() }
  function fn3(next) { ran.push(3) ; next() }

  tasks({}, [
    function(next, _, control) {
      control.prepend([
        fn1, fn2, fn3
      ])
      next()
    },

    function last(next) {
      soFar = ran.length
      next()
    }
  ], function() {
    t.equal(ran.length, 3, 'should run `fn` function 3 times, in order')
    t.same(ran, [1, 2, 3], 'should run fns in order')
    t.equal(soFar, 3, 'should run `last` after prepended functions')
    t.end()
  })
})

tap.test('append functions', function(t) {
  let
    ran = [],
    soFar = null
    ; // end of let list

  function fn1(next) { ran.push(1) ; next() }
  function fn2(next) { ran.push(2) ; next() }
  function fn3(next) { ran.push(3) ; next() }

  tasks({}, [
    function(next, _, control) {
      control.append([
        fn1, fn2, fn3
      ])
      next()
    },

    function second(next) {
      soFar = ran.length
      next()
    }
  ], function() {
    t.equal(ran.length, 3, 'should run three functions')
    t.same(ran, [1,2,3], 'should run fns in order')
    t.equal(soFar, 0, 'should run `second` before appended functions')
    t.end()
  })
})

tap.test('should clear remaining functions', function(t) {
  let ran = 0

  function fn(next) { ran++ ; next() }

  tasks({}, [
    function(next, _, control) {
      control.clear()
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
    function(next, _, control) {
      control.prepend(
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
    t.equal(ran, 7, 'should call all prepended functions')
    t.end()
  })
})

tap.test('should flatten array provided to append()', function(t) {
  let ran = 0

  function fn(next) { ran++ ; next() }

  tasks({}, [
    function(next, _, control) {
      control.append(
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
    t.equal(ran, 7, 'should call all appended functions')
    t.end()
  })
})

tap.test('should use setImmediate', function(t) {
  let
    ran = 0,
    exec = false
    ;

  function fn(next) { ran++ ; next() }

  tasks({}, [
    fn,
    fn,
    fn,
  ], function() {
    t.equal(ran, 3, 'should call function three times')
    t.ok(exec, 'should use provided executor')
    t.end()
  }, function() {
    exec = true
    setImmediate.apply(this, arguments)
  })
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
