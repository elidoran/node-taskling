# taskling
[![Build Status](https://travis-ci.org/elidoran/node-taskling.svg?branch=master)](https://travis-ci.org/elidoran/node-taskling)
[![npm version](https://badge.fury.io/js/taskling.svg)](http://badge.fury.io/js/taskling)
[![Coverage Status](https://coveralls.io/repos/github/elidoran/node-taskling/badge.svg?branch=master)](https://coveralls.io/github/elidoran/node-taskling?branch=master)

Small simple async function series with prepend/append/clear during run.

Features:

1. Provides a shared object to each task function
2. execution ends when a task provides an error to the callback
3. mutable task queue via `prepend()`, `append()`, `clear()`


## Install

```sh
npm install --save taskling
```


## Usage

```javascript
const tasks = require('taskling')

// create a shared object to hold data usable by all task functions:
const shared = {}

// create an array of functions (tasks) to run:
const array = [
  // must always call the first arg, next(), when done.
  function first(next) { next() },

  // second arg is the `shared` we provide to tasks()
  function second(next, sharedObject) { next() },

  // the `this` context is a "control" object with helper functions:
  function controlled(next) {
    // prepend/append:
    //   - require an array argument.
    //   - accept nested arrays.

    // add array of functions to run *next*,
    // so they go in the front of the queue/array:
    this.prepend([/* ... */])

    // same as prepend() except they are added to the end.
    this.append([/* ... */])

    // empty the tasks array:
    this.clear()

    next()  // always call next()
  },
]

// a "done" function is called when tasks are done.
// if an error is provided by a task then execution stops
// and the "done" callback is called with the error as first arg.
// if no error is provided, ever, then "done" is called last.
function done(error, result) {
  // do something with error, if it exists...
  // otherwise, it was a success.
  // get your results from the `sharedObject`,
  // or, the last task can provide a `result` as the 2nd arg.
}

// now, use those three things to run the tasks:
tasks(shared, array, done)

// NOTE:
//  tasks() will always return immediately before it begins execution.
//  this is the standard behavior for asynchronous API's.


// Succinct use:
require('taskling')({
    // the shared object
  }, [
    // the tasks array
  ],
  function(error, result) {
    // the "done" callback
  }
)
```

### map+require

I usually separate out my task functions into separate modules. Then, instead of writing `require()` every for each one I use `map(require)` on the array.

```javascript
var array = [
  'some-package',     // some published package providing a task function
  './some/module.js', // some local module providing a task function
].map(require)

// or in the whole thing as "succinct" version:
require('taskling')({
  // shared object
}, [
  'some-package',
  './some/module.js',
].map(require), function(error) {
  // all done...
})
```

## [MIT License](LICENSE)
