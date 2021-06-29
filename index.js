'use strict'

// shared    - shared object given to every function as 2nd arg.
// taskArray - array of functions to call.
// done      - error accepting callback.
// executor  - defaults to process.nextTick, could be setImmediate.
module.exports = function runTasks(shared, taskArray, done, executor) {
  const
    flatten = require('@flatten/array'),      // allow nested arrays,
    tasks = [flatten(taskArray).reverse()],   // by flattening.
    run = executor || process.nextTick,       // run with nextTick by default.
    prepend = a => { tasks.unshift(flatten(a).reverse()) },
    append = a => { tasks.push(flatten(a).reverse()) },
    clear = () => { // allow clearing future tasks.
      tasks.forEach(a => { a.length = 0 })    // clear inner arrays, too.
      tasks.length = 0                        // then clear outer array.
    },
    control = { prepend, append, clear, tasks }, // combine tasks w/utils
    next = (error, result) => {           // iterator given to each task.
      if (error || tasks.length < 1) {    // end on error or all done.
        done(error, result)
      } else {                            // else, do next fn.
        const fn = tasks[0].pop()         // get next fn.
        if (tasks[0].length < 1) {        // if array is empty,
          tasks.shift()                   // shift() it out.
        }
        fn(next, shared, control)         // call the fn.
      }
    }
  ; // end of const list.

  run(next) // return now, begin async later.
}
