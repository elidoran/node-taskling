var assert  = require('assert')
var optimal = require('@optimal/fn')
var tasks   = require('./index.js')

describe('verify optimizability', function() {

  it('with basic args', function(done) {
    var count = 3
    var result = optimal(tasks, null, [
      {},
      [
        function(next) { next() }
      ],
      function() {
        count--
        if (count <= 0) done()
      },
    ])

    assert.equal(result.optimized, true)
  })

})
