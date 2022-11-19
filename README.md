# Debug Log Macro for JavaScript/TypeScript

[中文版](./README_zh.md)

A lightweight JS/TS Debug Logger that encapsulates console.log and uses a special code writing method optimized for Minifier to compress shorter codes for temporary deployment everywhere.

## Basic Usage

1. Copy the `LogFactory` function from `debugLogMacro.min.js` or `debugLogMacro.min.ts` into your code's global scope or function scope similar to the global scope.
2. Use the `LogFactory` function in the function or class of your own code to generate a `Log` instance, and call the Log instance itself or its member functions to log to the console.
3. After the debugging is finished and the code tests pass, all Log functions and LogFactory functions should be removed.

## API

### Logger Factory

```ts
function LogFactory(tag: string, parentLog?: Log): Log; 
```

Parameters:

- `tag` : Usually the name or fully qualified name of the function to which the Log instance belongs.
- `parentLog` (Optional) : **The Log instance of the function caller (parent function)**, used to output the function call path, especially for asynchronous operations.

Return value:

- Logger instance `Log`.

### Logger

```ts
interface Log {
  (...obj: any): void;
  t(...obj: any): void;
  s(...obj: any): void;
}
```
```ts
const log: Log = LogFactory(tag, parentLog);
```
Logs are output to the console using `console.log`.

Instance methods:

- `Log()` : Output its own TAG, ID and parameter values to the log.
- `Log.t()` : Output the TAG and ID of itself and the parent function, and its own parameters to the log.
- `Log.s()` : Output the TAG and ID of itself and all superior functions, and its own parameters to the log.

Parameters:

- `...obj` (Optional) : Object to log.

## Examples

### Demo of all features

```js
function LogFactory(...){...}

const A = LogFactory("A", LogFactory("B", LogFactory("C", LogFactory("D"))));
A(1);
A.t(2);
A.s(3);
```

Execution result sample:

```log
[A 06511152653393193] 1
[A 06511152653393193][B 9452492786516524] 2
[A 06511152653393193][B 9452492786516524][C 952512427745682][D 6683961490453685] 3
```

### Wrap logger

This demonstrates how to always add the class TAG before the function TAG.

```ts
function LogFactory(...){...}

class TestController {
  private static readonly LogFactory = (tag: string, pLog?: Log) => LogFactory(`TestController.${tag}`, pLog);

  foo() {
    const log = TestController.LogFactory("foo");
    log(9); // output: [TestController.foo xxxxxxxxxxxxxx] 9
  }
}
```

### Simulation of business scenarios

```js
import axios from 'axios';

function LogFactory(...){...}

const web = { // namespace
  viewmodel: {
    data: {/* ... */},
    handleSaveClick() {
      const log = LogFactory("handleSaveClick");
      // log message with tag and id of self
      web.service.save(web.viewmodel).then(() => log("OK"), () => log("Failed"));
    }
  },
  service: {
    async save(vm, pLog) {
      const log = LogFactory("servicesave", pLog);
      /* ... */
      let response = await api.DataController.saveData(vm.data);
      log.t(reponse); // log message with tag and id of self and parent
      /* ... */
    }
  }
};

const api = { // namespace
  DataController: {
    async saveData(data, pLog) {
      const log = LogFactory("DataController.saveData", pLog);
      log.s(); // log tag and id of self and all superiors
      await axios.post("...");
    }
  }
};
```