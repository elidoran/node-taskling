var assert = require('assert')
var tasks  = require('./index.js')

describe('test taskling', function() {

  it('should complete by calling done()', function(done) {
    tasks({}, [], done)
  })

  it('should run a function', function(done) {
    var ran = false
    tasks({}, [
      function(next) {
        ran = true
        next()
      }
    ], function() {
      assert.equal(ran, true, 'should run function')
      done()
    })
  })

  it('should run functions', function(done) {
    var ran = 0
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
      assert.equal(ran, 3, 'should run 3 functions')
      done()
    })
  })

  it('should provide same shared object to functions', function(done) {
    var object = {
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
      assert.equal(object.first, true)
      assert.equal(object.second, true)
      assert.equal(object.third, true)
      done()
    })
  })

  it('should start later', function(done) {
    var started = false
    tasks({}, [
      function(next) {
        started = true
        next()
      }
    ], done)

    assert.equal(started, false, 'should start async run later')
  })

  it('should stop execution and give error to done()', function(done) {
    var ran = 0
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
      assert.equal(error, 'error')
      assert.equal(result, null)
      assert.equal(ran, 1, 'should only run first function')
      done()
    })
  })

  it('should prepend functions', function(done) {
    var ran = 0
    var soFar = null
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
      assert.equal(ran, 3, 'should run `fn` function 3 times')
      assert.equal(soFar, 3, 'should run `last` after prepended functions')
      done()
    })
  })

  it('should append functions', function(done) {
    var ran = 0
    var soFar = null
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
      assert.equal(ran, 3, 'should run `fn` function 3 times')
      assert.equal(soFar, 0, 'should run `second` before appended functions')
      done()
    })
  })

  it('should clear remaining functions', function(done) {
    var ran = 0
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
      assert.equal(ran, 0, 'should clear functions')
      done()
    })
  })

  it('should flatten array provided to prepend()', function(done) {
    var ran = 0
    function fn(next) { ran++ ; next() }

    tasks({}, [
      function(next) {
        this.prepend(
          [
            [
              fn,
              [fn],
              fn,
            ]
          ]
        )
        next()
      },
    ], function() {
      assert.equal(ran, 3, 'should call all three prepended functions')
      done()
    })
  })

  it('should flatten array provided to append()', function(done) {
    var ran = 0
    function fn(next) { ran++ ; next() }

    tasks({}, [
      function(next) {
        this.append(
          [
            [
              fn,
              [fn],
              fn,
            ]
          ]
        )
        next()
      },
    ], function() {
      assert.equal(ran, 3, 'should call all three appended functions')
      done()
    })
  })

})
