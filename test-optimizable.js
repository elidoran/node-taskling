'use strict'

const assert  = require('assert')
const optimal = require('@optimal/fn')
const tasks   = require('./index.js')

describe('verify optimizability', function() {

  it('with basic args', function(done) {
    let count = 3

    const result = optimal(tasks, null, [
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
