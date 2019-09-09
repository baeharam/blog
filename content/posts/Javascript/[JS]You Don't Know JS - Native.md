---
title: "[Javascript] You Don't Know JS: 네이티브"
date: 2019-08-28T20:39:12+09:00
categories: ["Javascript"]
tags: ["Javascript", "You Don't Know JS", "네이티브"]
draft: false
---

## 네이티브(Native)의 정의

이 책을 공부하면서 "네이티브"라고 불리는 것이 있다는 것을 처음 알았다. JS에서 네이티브란 다음을 일컫는 용어이다.

>Object in an ECMAScript implementation whose semantics are fully defined by this specification rather than by the host environment.
>
>특정 환경(브라우저, 운영체제 등)에 종속되지 않은, ECMAScript 명세의 내장 객체

즉 기존에 JS 명세에서 정의하고 있는 내장 함수인 셈이다. 네이티브와는 다르게 환경에 종속되는 것은 호스트 객체(Host Object)라고 하는데 DOM,BOM과 같은 것들을 조작할 때 사용하는 객체가 이에 속한다. 네이티브의 종류로는 Object, String, Number, Boolean, 등이 있으며 앞으로 이것들의 특징에 대해 살펴보기로 한다.



## [[Class]]

`typeof` 연산자를 적용하여 그 값이 `object` 라면 내부 프로퍼티로 `[[Class]]` 라는 프로퍼티를 갖는다. 이는 `Object.prototype.toString()` 메소드를 통해서 확인할 수 있다.

```javascript
Object.prototype.toString.call([1,2,3]); // [object Array]
Object.prototype.toString.call(/regex-literal/i); // [object RegExp]
Object.prototype.toString.call(null); // [object Null]
Object.prototype.toString.call(undefined); // [object Undefined]
```

`[[Class]]` 프로퍼티는 내장 네이티브 생성자를 가리키는 것이 보통이지만 `null` 과 `undefined` 처럼 그렇지 않을 때도 있으며 원시값의 경우엔 **래퍼객체(Wrapper Object)** 로 **박싱(Boxing)** 하는 과정을 거치게 된다. (여기서 말하는 래퍼객체란 네이티브 객체를 말한다.)

```javascript
Object.prototype.toString.call("abc"); // [object String]
Object.prototype.toString.call(3); // [object Number]
Object.prototype.toString.call(false); // [object Boolean]
```

JS 엔진이 원시값을 알아서 객체 래퍼로 박싱하기 때문에 내장 네이티브 생성자가 자동으로 쓰이게 되는 것이다. 박싱의 개념이 이해가 안돼서 조금 더 찾아보니 엔진이 자동으로 박싱할 때는 2가지 경우이다. ([SO 질문](https://stackoverflow.com/a/17217024/11789111))

* `call()` 이나 `apply()` 의 첫번째 인자로 넘길 때 `this` 키워드를 사용해야 하므로 객체래퍼로 박싱한다.
* 원시값에 해당하는 객체래퍼의 프로퍼티에 접근할 때.



## 네이티브를 생성자로 사용해도 괜찮을까?

네이티브 객체는 래퍼객체로 박싱하는 생성자 함수로 사용될 수도 있는데 이는 수많은 오류를 야기시킬 수 있기 때문에 특별한 경우를 제외하고는 **결코 권장되지 않는 방법이다.**

* `Array()` 는 그냥 사용하지 말자, 인자를 전달하게 되면 브라우저마다 다른 값을 도출시킬 수 있다.
* `Object()` 는 굳이 사용할 일이 없다.
* `Function()` 은 함수의 인자나 내용을 동적으로 정의해야 할 때 사용되는데 거의 그럴일이 없다.
* `RegExp()` 는 정규표현식을 동적으로 정의할 때 유용하다. 그러나 그런 경우가 아니라면 리터럴로 정의하는 것이 **성능면에서 이득이다.**
* `Date()`, `Error()`, `Symbol()` 은 원시값이 없고 용도에 맞게 잘 사용하면 된다.



## 네이티브 프로토타입

내장 네이티브 생성자는 각각의 프로토타입 객체를 가지는데 2가지를 꼭 기억하자.

* 네이티브 프로토타입을 절대로 변경하지 말자. 예기치 못한 상황이 발생할 수 있다.
* 네이티브 프로토타입은 **디폴트 값** 이다.
  * `Function.prototype` 은 빈 함수이다.
  * `RegExp.prototype` 은 빈 정규식이다.
  * `Array.prototype` 은 빈 배열이다.

네이티브 프로토타입이 디폴트라는 것을 활용하면 디폴트 값을 리터럴로 사용하는 것에 비해 성능적인 이점을 얻을 수 있다. 이유는 내장된 상태이므로 단 한 번만 생성된다는 것이다. 아래와 같이 사용할 수 있다.

```javascript
function nativePrototype(arr, fn, rx){
  arr = arr || Array.prototype;
  fn = fn || Function.prototype;
  rx = rx || RegExp.prototype;
  ....
}
```



## 참조

* [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)

