---
title: "[Javascript] You Don't Know JS: 타입과 값"
date: 2019-08-28T20:39:12+09:00
categories: ["Javascript"]
tags: ["Javascript", "You Don't Know JS"]
draft: false
---

## 특이한 typeof

`typeof` 연산자는 피연산자의 타입을 문자열 형태로 리턴하는 연산자이며 여러가지 특이한 부분이 있다.

```javascript
typeof null; // object
typeof undefined; // undefined
typeof function(){} // function
typeof [] // object
```

제일 특이한 부분이 `null` 값의 타입이 `object` 라는 것이며 이는 falsy 한 값이기 때문에 다음과 같이 확인하는 것이 정확하다.

```javascript
var a = null;
(!a && typeof a === 'object'); // true
```



## 선언되지 않은 것 vs 정의되지 않은 것

Undeclared(선언되지 않은 것)과 undefined(정의되지 않은 것)는 완전히 다른 개념이다. Undeclared의 경우는 아예 변수 자체가 선언되지 않음을 뜻하며 undefined는 변수에 값이 할당되지 않은 것을 말한다.

```javascript
var a;
a; // undefined
b; // ReferenceError: b가 정의되지 않았습니다.
```

따라서 위와 같이 사용할 경우 에러가 발생한다.



## typeof 안전가드(Safety Guard)

방금 위에서 본 차이점을 통해서 undeclared 변수를 사용하려고 할 경우에 에러가 발생한다는 것을 알 수 있다. 하지만 `typeof` 연산자를 사용한다면 모두 `undefined` 값이 나온다.

```javascript
var a;
typeof a; // undefined
typeof b; // undefined
```

따라서 이 특성을 적극 활용하면 다음과 같은 경우에 유용하다.

* 전역 네임스페이스를 공유하고 있고 특정한 전역변수가 존재하는지 확인할 때
* 사용하는 유틸리티 파일에 특정 변수가 존재하는지 확인할 때

```javascript
function doSomething() {
  var helper = (typeof FeatureXYZ !== 'undefined') ? FeatureXYZ : function() {}
  .....
}
```

위와 같이 안전가드를 사용할 수 있다.



## 유사배열을 배열로 바꾸자!

* `Array.prototype.slice` 사용 (ES6 이전)

```javascript
function test() {
  var arr = Array.prototype.slice.call(arguments);
  console.log(arr);
}
test(1,2,3); // [1, 2, 3]
```

* `Array.from` 사용 (ES6)

```javascript
function test() {
  var arr = Array.from(arguments);
  console.log(arr);
}
test(1,2,3); // [1, 2, 3]
```



## 문자열과 배열은 다르다.

문자열은 유사배열이며 불변 값이지만 배열은 가변값이다. 따라서 배열에서 유용한 가변배열 메서드는 불변 값인 문자열에서 사용할 수 없다. 하지만 배열에서도 불변배열 메서드가 있기 때문에 그걸 문자열에 빌려쓸 수 있는 형태이다.

```javascript
var a = 'foo';
var b = Array.prototype.join.call(a, '-'); // 'f-o-o'
var c = Array.prototype.map.call(a, function(aa) {
  return aa.toUpperCase() + '.';
}).join(''); // 'F.O.O.'
```

불변배열 메서드인 `join` 과 `map` 은 문자열에 쓸 수 있는 걸 볼 수 있다.

배열에는 가변배열 메서드인 `reverse` 가 있는데 이는 역시 가변배열 메서드이기 때문에 문자열에 사용할 수 없다. 따라서 야매스러운 방법을 사용한다.

```javascript
var a = '123';
var c = a.split('').reverse().join(''); // '321';
```

문자열을 배열르 분할한 후에 역으로 나열하고 그걸 합치는 방법이다. 이는 단순 문자열에 굉장히 효과적이지만 유니코드 문자가 섞여 있는 경우는 불가하니 유니코드의 경우를 사용하고 싶다면 [Esrever](https://github.com/mathiasbynens/esrever) 를 참고하자.



## 숫자 소수점 이하 조정하기

```javascript
var a = 77.89;
a.toFixed(0); // 77
a.toPrecision(2); // 77
```

기능은 비슷하지만 `toFixed` 의 경우 소수점 이하의 개수를 지정하고 `toPrecision` 의 경우는 유효숫자의 개수를 지정한다.



## undefined와 null

undefined와 null 모두가 primitive type인데 특징이 다르다.

* **undefined**
  * 식별자(identifier)로 사용될 수 있다.
  * 값이 비어있는 상태를 표현한다. 즉, 선언은 되었지만 할당되지 않은 상태이다.
* **null**
  * 식별자로 사용될 수 없다.
  * "값 아닌 값"을 표현한다. 즉, 값이 아닌것을 표현하는 값이다.



## NaN, 무한대, 0

### NaN(Not a Number)

* NaN은 "숫자 아님"이라는 뜻의 값으로 경계값(Sentinal Value)의 일종이다. 숫자 집합에서 특정한 종류의 에러 상황을 나타내기 때문에 `typeof` 연산자를 적용하면 `number` 를 리턴한다. 

* 전역객체인 `window` 가 `isNaN()` 이라는 판단함수를 가지고 있지만 이는 "숫자 아님"을 판단하고 NaN에 대해선 엄밀히 판단하지 못한다. 따라서 ES6에 도입된 `Number.isNaN()` 을 사용해야 한다.

* NaN은 **자기 자신과도 동등하지 않은 유일한 값** 으로 반사성(Reflexivity)이 없다.

* ```javascript
  var a = 'NaN' / 3; // NaN
  a === a; // false
  ```

### 무한대

```javascript
var a = 1 / 0; // Infinity == Number.POSITIVE_INFINITY
var b = 1 / -0; // Infinity == Number.NEGATIVE_INFINITY
var c = a / b; // NaN
```

## 0

`-0` 도 있다는 것을 알아두자.

```javascript
var a = 0 / 3; // 0
var b = 0 / -3; // -0
```

여기서도 이상한 현상이 있는데 문자열 `'-0'` 을 `-0` 으로 변환시킬 때는 잘 되지만 그 역은 `0` 으로만 나온다.

```javascript
var a = '-0';
var b = -0;
Number(a); // -0
b.toString(); // '0'
```

비교를 할 때도 `0` 과 `-0` 은 `==` 를 쓰든지 `===` 를 쓰든지 같다고 도출되기 때문에 ES6에서 도입된 `Object.is()` 를 사용하도록 하자. 이 부분은 NaN의 비교에도 마찬가지이다.



## 참조

* [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)

