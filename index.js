'use strict'

// ignore for coverage. its coverage is checked manually with the two different
// node versions required to test both branches of the statement.
/* istanbul ignore next */
const flatten = // allow nested arrays. try to use node 12's builtin flatten.
  Array.prototype.flat ?
    (array) => { return array.flat(Infinity) } // eslint-disable-line brace-style
    : require('@flatten/array')

// shared    - shared object given to every function as 2nd arg.
// taskArray - array of functions to call.
// done      - error accepting callback.
// executor  - defaults to process.nextTick, could be setImmediate.
module.exports = function runTasks(shared, taskArray, done, executor) {

  // allow nested arrays.
  const tasks = flatten(taskArray)

  // run with nextTick by default.
  const run = executor || process.nextTick

  // combine tasks w/utils
  const control = { prepend, append, clear, tasks }

  // iterator given to each task.
  function next(error, result) {

    // end on error or all done.
    if (error || tasks.length < 1) done(error, result)

    // call next function.
    else tasks.shift().call(control, next, shared)
  }

  run(next) // return now, begin async later.
}

function prepend(array) { // add array of tasks to front of tasks array
  this.tasks.unshift.apply(this.tasks, flatten(array))
}

function append(array) { // add array of tasks to end of tasks array
  this.tasks.push.apply(this.tasks, flatten(array))
}

function clear() { // empty tasks array
  this.tasks.length = 0
}
