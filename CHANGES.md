## 1.3.0 - 2019/06/02

1. apply array flatten to task array given to main taskling function (it was already flattening those to prepend/append).
2. uses the new builtin `Array.flat()` of node 12, when available (pass `Infinity` for depth).
3. tweak some tests to be tougher (more depth/complexity in the arrays to flatten).


## 1.2.0 - 2019/05/18

1. added ability to specify which function will run the tasks so setImmediate can be used instead of process.nextTick.
2. updated README to explain new option
3. update deps
4. drop node 6


## 1.1.1 - 2019/04/29

1. switch node 11 to 12
2. update deps

## 1.1.0 - 2019/01/07

1. add strict mode
2. use const
3. reformat for spacing and put comments on line above code line.
4. accept a result to iterator so it can be provided to the done callback.
5. add 2019 to license.
6. drop node 4, add node 10 and 11.
7. update deps


## 1.0.2 - 2017/06/22

1. fix main file inclusion by removing 'lib/' in package.json

## 1.0.1 - 2017/06/18

1. added section to README about using `map(require)` to pull packages/modules into task array.

## 1.0.0 - 2017/06/18

1. initial working version with tests and 100% code coverage
