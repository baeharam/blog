---
title: "[Javascript] Symbol"
date: 2019-07-19T20:25:19+09:00
categories: ["Javascript"]
tags: ["Javascript","ES6","Symbol"]
draft: true
---

## 개요

Symbol은 ES6에서 새로나온 원시타입(Primitive Type)으로 기존 6가지 타입에 추가된 것이다. Symbol이 필요한 이유는 객체내의 고유한 키값을 갖는 프로퍼티를 정의하기 위함이다. 이 특성이 필요한 이유는 특정 애니메이션이나 로직을 캐치하기 위해 플래그(Flag)를 설정할 때 기존 방법들(불리안 값, 난수, 등)에 문제가 있기 때문이다.



## 생성

Symbol을 생성할 때는 타입이기 때문에 `new` 를 생략한다.

```javascript
let symbol = Symbol();
```

이로써 새로운 Symbol이 생성된 것이며 이를 객체의 프로퍼티 명으로 설정할 경우 **어떠한 프로퍼티와도 충돌하지 않는다.**

```javascript
let obj = {};
obj[symbol] = 'symbol';
```

또한 인자로 문자열을 전달할 수 있는데 이는 디버깅하기 위한 용도로 쓰인다.

```javascript
let symbol = Symbol('For debugging');
console.log(symbol); // Symbol(For debugging)
```

주석이라고 생각하면 되는데 같은 주석을 가진다 하더라도 다른 Symbol 이므로 주의하자.



## 공유

Symbol이 고유한 값을 가지기는 하지만 공유할 수 있는데 이는 `Symbol.for()` 메서드를 사용하면 된다.

```javascript
let symbol = Symbol.for('key');
```

이렇게 생성하면 먼저 전역 심볼 레지스트리에서 `'key'` 에 해당하는 Symbol을 찾고 없으면 생성하는 형태이다. 따라서 기존 Symbol을 가져다 쓸 수 있는 것이다.

```javascript
let symbol = Symbol.for('symbol');
let obj = {};
obj[symbol] = 'symbol';
console.log(obj[symbol]); // symbol
let symbol2 = Symbol.for('symbol');
console.log(obj[symbol2]); // symbol
```

기존에 Symbol을 생성할 때는 키 값이 같아도 다른 Symbol로 취급하지만 여기선 전역 심볼 레지스트리에 등록해서 찾는 방식이므로 위와 같은 결과가 나오게 된다.



## 검색

전역 심볼 레지스트리에 특정 Symbol의 키 값을 알아낼 수 있다.

```javascript
let symbol = Symbol.for('global');
console.log(Symbol.keyFor(symbol)); // global
let symbol2 = Symbol('local');
console.log(Symbol.keyFor(symbol2)); // undefined
```

Symbol의 프로퍼티 또한 검색할 수 있는데 이는 기존의 `Object.keys()` 나 `Object.getOwnPropertyNames()` 를 통해서 찾을 수 없다. ES6에서 새로 제공되는 `Object.getOwnPropertySymbols()` 를 사용해야 한다.

```javascript
// 위 코드에 이어서
let obj = {
  [symbol]: 'symbol'
};
console.log(Object.keys(obj)); // []
console.log(Object.getOwnPropertyNames(obj)); // []
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(symbol)]
```



## Well-Known Symbols

기존의 자바스크립트에는 객체의 특정한 기능을 정의하는 대표적인 Symbol 들이 있으며 이를 well-known symbol이라고 한다. 대표적인 예로는 다음과 같은 것들이 있다.

* `Symbol.hasInstance` : `instanceof` 연산자가 사용하는 메서드이다.

```javascript
console.log([] instanceof Array); // true
console.log(Array[Symbol.hasInstance]([])); // true
```

* `Symbol.isConcatSpreadable` : `Array.prototype.concat()` 이 동작하는 방식은 원래 배열의 요소로서 덧붙여주는 형태이지만 이 속성을 `false` 로 바꿔버리면 배열 그대로 들어가게 된다.

```javascript
let a = [1,2,3];
let b = [4,5,6];

console.log(a.concat(b)); // [1,2,3,4,5,6]
a[Symbol.isConcatSpreadable] = false;
console.log(a.concat(b)); // [[1,2,3],4,5,6]
```



## 참조

* [ECMAScript 6 Symbol과 Symbol 프로퍼티](https://infoscis.github.io/2018/01/27/ecmascript-6-symbols-and-symbol-properties/)
* [7번째 타입 심볼(Symbol)](https://poiemaweb.com/es6-symbol)
* [JS Symbol and Well-known symbols](https://medium.com/@obaranovskyi/js-symbol-and-well-known-symbols-c3c9cc395b6d)