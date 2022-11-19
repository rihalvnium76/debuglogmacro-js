# Debug Log Macro for JavaScript/TypeScript

一个针对Minifier优化的采用特（xie）殊（dao）写法以压缩出更短代码方便到处临时部署的封装了console.log的轻型JS/TS Debug Logger。

## 基本使用

1. 将 `debugLogMacro.min.js` 或者 `debugLogMacro.min.ts` 中的 `LogFactory` 函数复制到你的代码的全局作用域或者类似全局作用域的函数作用域中。
2. 在自己代码的函数或类中使用 `LogFactory` 函数生成 `Log` 实例，调用Log实例本身或其成员函数记录日志到控制台。
3. 在调试结束，代码测试通过后，应移除所有的Log函数和LogFactory函数。

## API

### 日志记录器工厂函数

```ts
function LogFactory(tag: string, parentLog?: Log): Log; 
```

参数：

- `tag` : **标识符**，通常为Log实例所属的函数的名称或全限定名。
- `parentLog` (可选) : **函数调用者（父函数）的Log实例**，用于输出函数调用路径，尤其是异步操作的。

返回值：

- 日志记录器实例 `Log`

### 日志记录器

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
日志使用 `console.log` 输出到控制台。

实例方法：

- `Log()` : 输出自身的TAG、ID和参数值到日志
- `Log.t()` : 输出自身和父函数的TAG和ID，和自身的参数到日志
- `Log.s()` : 输出自身和所有上级函数的TAG和ID，和自身的参数到日志

参数：

- `...obj` (可选) : 输出到日志的对象

## 使用例子

### 全功能演示

```js
function LogFactory(...){...}

const A = LogFactory("A", LogFactory("B", LogFactory("C", LogFactory("D"))));
A(1);
A.t(2);
A.s(3);
```

执行结果样例：

```log
[A 06511152653393193] 1
[A 06511152653393193][B 9452492786516524] 2
[A 06511152653393193][B 9452492786516524][C 952512427745682][D 6683961490453685] 3
```

### 二次封装

这里演示了如何固定在函数的TAG前添加类的TAG。

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

### 模拟业务场景

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