---
title: "[Javascript] 함수형 프로그래밍의 기본"
date: 2019-07-12T17:14:19+09:00
categories: ["Javascript"]
tags: ["Javascript","함수형 프로그래밍"]
cover: "/images/cover/javascript.jpeg"
draft: false
---

## 개념

함수형 프로그래밍이란 연산할 대상이 "함수"가 되는 프로그래밍 패러다임으로 내부의 데이터와 상태를 **그대로 둔 채** 여러가지의 함수를 조합하여 작업을 수행하는 방식이다. 선언형 프로그래밍(Declarative Programming)의 한 종류로 기존의 절차지향 프로그래밍, 객체지향 프로그래밍이 속하는 명령형 프로그래밍(Imperative Programming)과는 다른 부류이다. 기존에 나는 명령형 프로그래밍으로 공부해왔기 때문에 이 개념이 익숙치 않고 이를 위해서 계속 정리하고자 한다.

### 순수 함수(Pure Function)

순수함수는 말 그대로 순수한 함수, 즉 외부의 요인을 건드리지 않은채 매개변수를 받아 자신에게 정해진 로직만을 처리하는 함수를 말한다. 이는 부작용(Side Effect)을 제거하려는 함수형 프로그래밍의 철학이 말하는 것이다. 예를 들어, 다음과 같은 함수를 보자.

```javascript
var a,b,c,d,e,f;
function add(x,y){
  return x+y;
}
```

이는 매개변수 2개를 더해서 리턴하는 함수이다. 함수 내부에서 `x`, `y` 를 제외한 다른 변수들을 고려하지 않는다. 따라서 이러한 순수 함수는 다른 작업들에 독립적으로 사용할 수 있다. 단, 순수함수가 되기 위해선 매개변수를 통해 작업을 처리하고 어떤 결과를 반환해야 한다는 것을 잊지말자.

### 1급 객체(First-class Object)

1급 객체란 간단하게 말해서 아래의 조건을 만족하는 객체를 말한다.

* 변수에 담을 수 있다.
* 인자로 전달할 수 있다.
* 반환값으로 전달할 수 있다.

자바스크립트에선 함수 또한 객체이기 때문에 함수는 1급 객체이다. 함수형 프로그래밍은 이러한 1급 객체의 특성을 활용하는 것이라고 할 수 있다.

### 고차 함수(Higher-order Function)

함수가 1급 객체이기 때문에 함수를 하나의 값을 간주하여 함수의 인자 혹은 반환값으로 사용할 수 있으며 이를 고차 함수라고 한다. 고차 함수를 사용하면 계속해서 로직이 변화하는 함수를 인자로 전달하여 전달받은 함수를 활용해서 의도하는 목적을 달성할 수 있다. 예를 들어, 2개의 매개변수를 곱해서 10이면 덧셈 그게 아니면 뺄셈을 하는 코드가 있다고 치자.

```javascript
function func(a,b) {
  if(a*b === 10) {
    return a+b;
  }
  else {
    return a-b;
  }
}
```

만약 `10` 이라는 조건을 몫 연산자와 나머지 연산자에 적용하고 싶다면 그에 해당하는 로직을 따로 구현해야 한다. 하지만 함수를 인자로 넘기는 방식의 고차 함수를 활용하면 편하게 구현할 수 있다.

```javascript
function func(a,b,cond) {
  if(cond(a,b) === 10) {
    return a+b;
  } else {
    return a-b;
  }
}
```

위 예시에선 함수를 매개변수로 받기만 했지만 함수를 반환할 수도 있다. 이는 이후에 나올 개념들을 보면서 알아보자.



## 메모이제이션 패턴이 적용된 경우

메모이제이션이란 중복되는 연산을 캐싱해 놓고 재사용하는 기법을 말하는데 이는 자바스크립트에서 2가지 방법으로 사용될 수 있다. 캐싱을 구현하는 방법들이다.

* 클로저 활용
* 함수의 프로퍼티 활용

### 클로저

클로저는 만들어질 당시의 스코프 체인을 기억하기 때문에 외부함수의 변수에 접근할 수 있다. 이를 활용하면 기존 연산의 결과값을 자유변수에 저장해놓는 캐싱 방식을 구현할 수 있게 된다. 대표적으로 팩토리얼을 구현할 때 사용하는 방식은 다음과 같다.

```javascript
var fact = function() {
  var cache = {'0': 1};
  var func = function(n) {
    if(typeof(cache[n])==='number'){
      return cache[n];
    } else {
      return cache[n] = n*func(n-1);
    }
  }
  return func;
}();
```

클로저인 `func` 은 항상 자유변수 `cache` 객체에 접근할 수 있으므로 캐싱을 사용할 수 있다.

### 함수의 프로퍼티

위와 똑같은 팩토리얼 예시를 구현하는데 함수의 프로퍼티를 활용해보자.

```javascript
function fact(n) {
  fact.cache = fact.cache || {};
  if(!fact.cache[0]) fact.cache[0] = 1;
  if(!fact.cache[n]){
    return fact.cache[n] = n*fact(n-1);
  } else {
    return fact.cache[n];
  }
}
```

먼저 `cache` 라는 프로퍼티가 없을 경우라면 객체 리터럴을 생성한다. 그 다음 기저사례인 $0!$ 에 대해서 초기화를 시키고 클로저 방식과 동일하게 알고리즘을 구현하면 된다.

이제 팩토리얼과 비슷한 로직인 피보나치 수열을 클로저 기법으로 구현해보자.

```javascript
var fact = function() {
  var cache = {'0': 0, '1': 1};
  var func = function(n) {
    if(typeof(cache[n])==='number'){
      return cache[n];
    } else {
      return cache[n] = func(n-2) + func(n-1);
    }
  }
  return func;
}();
```

이는 팩토리얼 함수와 재귀함수를 호출하는 형태만 다르다는 것을 확인할 수 있다. 따라서 이에 해당하는 함수와 캐시를 인자로 전달하는 고차함수를 구현하면 이를 다시 하나의 함수로 만들 수 있다.

### 팩토리얼과 피보나치 수열을 고차함수로!

```javascript
var highFunc = function(cache, func) {
  var calculator = function(n) {
    if(typeof(cache[n])==='number'){
      return cache[n];
    } else {
      return cache[n] = func(calculator,n);
    }
  };
};

var fact = highFunc({'0': 1}, function(func, n){
  return n*func(n-1);
});

var fibo = highFunc({'0': 0, '1': 1}, function(func, n){
  return func(n-2)+func(n-1);
});
```

결국 캐싱에 실패하면 특정 함수의 로직을 재귀적으로 호출해야 하는 것이 동일하기 때문에 다른 데이터인 캐싱과 해당 함수만 인자로 넘겨서 새로운 함수를 생성해낼 수 있는 것이다. `func(calculator,n)` 을 이해하기 힘들었는데, 이는 인자로 전달받은 함수의 로직을 처리할 때 재귀적으로 처리하니 그 재귀에 해당하는 함수를 넘기는 개념으로 이해하면 된다.



## 함수형 프로그래밍이 활용된 예시들

### 커링(Currying)

커링이란 특정 함수에서 정의된 인자의 일부를 넣어 고정시키고, 나머지를 인자로 받는 새로운 함수를 만드는 방법을 말한다. 이는 함수형 프로그래밍 언어에서 기본적으로 제공하지만 자바스크립트에선 제공하지 않기 때문에 `Function` 객체의 `prototype` 에 적용하는 방식을 사용한다.

```javascript
Function.prototype.curry = function() {
  var fn = this, args = Array.prototype.slice.call(arguments);
  return function() {
    return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
  }
}
```

여기서 인자를 고정시키는 부분은 `arguments` 객체에 배열의 메소드인 `slice` 를 적용하여 `args` 로 빼놓는 것이고 커링이 적용될 함수의 인자를 합치는 부분은 내부함수 안에 구현된 부분이다. 이는 아래와 같이 활용할 수 있다.

```javascript
var add = function(){
  var sum = 0;
  for(var i=0; i<arguments.length; i++){
    sum += arguments[i];
  }
  return sum;
};

var _add = add.curry(1,2,3);
console.log(_add(4,5,6)); // 21
```

처음 인자로 1,2,3을 고정시킨 상태에서 4,5,6을 전달하니 모든 값을 더한 21을 리턴하는 것이다.

### bind

bind는 커링 기법을 활용한 방식으로 바인딩할 `this` 를 인자로 전달한다는 점에서 커링과 다르다.

```javascript
Function.prototype.bind = function(thisArg) {
  var fn = this;
  var args = Array.prototype.slice.call(arguments,1);
  return function() {
    return fn.apply(thisArg, args.concat(Array.prototype.slice.call(arguments)));
  };
};
```

### Wrapper

Wrapper는 기존함수의 기능을 잃어버리지 않은 채로 새롭게 구현한 함수를 통해 덮어씌우는 방법이다. 이는 사용자 정의 로직을 추가하거나 버그를 피해가고 싶을 때 상당히 유용하다. 책의 예시코드가 이해하기 어렵기 때문에 하나하나 살펴보도록 하자.

```javascript
function wrap(object, method, wrapper) {
  var fn = object[method];
  return object[method] = function() {
    return wrapper.apply(this, [fn.bind(this)].concat(
      Array.prototype.slice.call(arguments)
    ));
  };
}
```

클로저를 활용한 고차함수가 사용된 것을 볼 수 있는데 객체와 메소드 이름을 넘겨받아 기존의 함수를 `wrapper` 를 통해 덮어씌우고 있다. `wrapper` 에는 기존의 함수도 넘겨주는데 이 때 `bind` 를 통해 `this` 를 바인딩시킨다. 이는 원래의 함수에서의 `this` 와 `wrapper` 에서의 `this` 가 다르게 되기 때문이다.

```javascript
Function.prototype.original = function(value) {
  this.value = value;
  console.log('value: ' + this.value);
};
```

기존의 함수는 위와 같다.

```javascript
var MyWrap = wrap(Function.prototype, 'original', function(orig_func, value){
  this.value = 20;
  orig_func(value);
  console.log('wrapper value : ' + this.value);
});

var obj = new MyWrap('haram');

// value: haram
// wrapper value : haram
```

새로 추가한 로직은 `this.value` 를 20으로 초기화하는 것인데 이 때 기존 함수를 호출한다. 기존 함수에 올바른 `this` 가 바인딩 되었으므로 20으로 초기화 되었던 것은 다시 `haram` 으로 초기화 되어 `haram` 이 2번 출력된다.



## 참조

* [함수형 프로그래머가 되고 싶다고? 파트 1](https://github.com/FEDevelopers/tech.description/wiki/함수형-프로그래머가-되고-싶다고%3F-(Part-1))
* [Javascript의 함수는 1급 객체이다](https://bestalign.github.io/2015/10/18/first-class-object/)
* [인사이드 자바스크립트](http://www.yes24.com/Product/Goods/11781589?scode=032&OzSrank=1)