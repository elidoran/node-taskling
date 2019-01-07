'use strict'

const flatten = require('@flatten/array') // allow nested arrays

// shared - shared object given to every function as 2nd arg.
// tasks  - array of functions to call.
// done   - error accepting callback.
module.exports = function runTasks(shared, tasks, done) {
  const control = { prepend, append, clear, tasks } // combine tasks w/utils

  function next(error) { // iterator given to each task.
    if (error || tasks.length < 1) done(error)     // end on error or all done.
    else tasks.shift().call(control, next, shared) // call next function.
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
