'use strict'

const flatten = require('@flatten/array') // allow nested arrays

// shared - shared object given to every function as 2nd arg.
// tasks  - array of functions to call.
// done   - error accepting callback.
module.exports = function runTasks(shared, tasks, done) {

  // combine tasks w/utils
  const control = { prepend, append, clear, tasks }

  // iterator given to each task.
  function next(error, result) {

    // end on error or all done.
    if (error || tasks.length < 1) done(error, result)

    // call next function.
    else tasks.shift().call(control, next, shared)
  }

  process.nextTick(next) // return now, begin async later.
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
