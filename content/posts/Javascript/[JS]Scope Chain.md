---
title: "[Javascript] Scope Chain"
date: 2019-07-10T11:11:26+09:00
categories: ["Javascript"]
tags: ["Javascript","Scope Chain","자바스크립트","스코프 체인"]
cover: "images/cover/javascript.jpeg"
draft: false
---

## Lexical Scoping

자바스크립트의 컴파일러는 토큰화(Tokenizing)와 렉싱(Lexing)을 처음에 하는데 이는 코드를 토큰 단위로 분리하여 의미를 매핑시키는 단계이다. Lex-time 이란 토큰에 의미를 부여하는 렉싱 과정을 말하며 이 때 자바스크립트의 스코핑 개념인 렉시컬 스코프가 형성된다.

Lexical scoping은 기존 함수 호출에 따른 dynamic scoping과는 반대되는 개념으로 함수를 선언할 때(Write time) 정의되는 스코핑 형태를 말한다. 말 그대로 함수가 어디에 적혀있는가에 따라서 스코프가 구성되는 방식이므로 lex-time과 연관이 되는 것이다. 따라서, 스코프 체인을 이해하기 위해선 lexical scoping에 대한 이해가 필수적이며 이 개념을 활용하여 구성되게 된다.



## Scope Chain

Scope chain은 EC가 만들어질 때 생성과 초기화가 처음으로 이루어지는 연결리스트 형태의 프로퍼티로 `[[Scopes]]` 로 참조되며 처음 요소가 현재 활성화된 EC의 변수객체를 가리키며 제일 나중에 GEC의 변수객체인 GO를 가리키는 형태로 구성된다.

```javascript
var a = 1;
function func1() {
  var b = 2;
  function func2() {
    console.log(a+b);
  }
  func2();
}
func1();
```

여기서 변수 `a` 는 GEC의 스코프체인에 속한 GEC의 변수 객체에 있으며 `b` 는 `func1` 의 EC의 스코프체인에 속한 해당 함수의 변수 객체에 있다. 즉 아래와 같이 구성된다.

<img src="/images/javascript/sc/sc1.png" width="600px">

EC가 생성되면서 쌓이게 되고 EC안에 스코프체인을 참조하는  `[[Scopes]]` 를 갖게 된다. 해당 프로퍼티는 연결리스트 형식으로 현재 스코프부터 상위 스코프를 참조하게 되는데, 이는 **변수식별(Identifier Resolution)**을 할 때 사용한다. GEC의 GO부터 각 함수의 AO를 보면 알 수 있듯이 렉시컬 스코핑으로 스코프가 구성됨을 알 수 있다.

결론적으로 엔진이 변수를 찾는(look-up) 과정은 스코프체인을 통해 이루어지며 이는 함수가 어떻게 호출되던 **오직 선언에만 의존한다는 것을 알 수 있다.**



## 클로저(Closure)

스코프체인에 대해 이해하면 스코프체인의 특성을 활용한 클로저라는 특성을 함수에 활용할 수 있는데 이는 자바스크립트에서 굉장히 중요한 개념으로 "You Don't Know JS" 에서는 다음과 같이 언급한다.

> *What I didn't know back then, what took me years to understand, and what I hope to impart to you presently, is this secret: **closure is all around you in JavaScript, you just have to recognize and embrace it.***

또한 개념 자체를 이해하는 것은 쉽지만 여러가지 부분에 활용되는 것이 매우 어렵기 때문에 완벽히 이해하고 그 활용을 익숙하게 해야 한다. 그럼 먼저 개념에 대해 이해하기 위해 아래와 같은 함수를 보자.

```javascript
function func() {
  var a = 1;
  function inner() {
    console.log(a);
  }
  return inner;
}

var outer = func();
outer(); // 1
```

다음 예시에서 `inner` 의 스코프체인을 보게 되면

```
inner의 활성객체 → func의 활성객체 → 전역객체 (스코프체인)
      ↑
    변수객체
```

위와 같은 형태로 구성될 것이며 `outer` 가 `inner` 를 리턴받아 실행되고 있다. `outer()` 는 `func()` 의 실행이 끝났음에도 불구하고 변수 `a` 를 참조하여 1을 출력하는데 바로 이러한 특성이 클로저의 개념이다. 그 이유는 `inner()` 가 가진 스코프체인이 가비지 컬렉터에 의해 제거되지 않고 남아있기 때문이다. 더글라스 크락포드는 클로저에 대해 다음과 같이 얘기한다.

> *An inner function always has access to the vars and parameters of its outer function, even after the outer function has returned…*

즉, `func()` 가 종료된다 하더라도 `func()` 의 렉시컬 스코프에 있는 변수들과 매개변수들을 `func()` 의 내부함수인 `inner()` 가 참조할 수 있다는 말이다. 따라서 `outer()` 는 `inner()` 의 스코프체인을 사용하여 변수 `a` 를 콘솔에 출력하게 된다.



## 클로저의 활용

### 반복문과 클로저

반복문과 클로저를 같이쓰게 되면 굉장히 헷갈리는데 그 이유는 클로저의 특성 때문에 의도한 대로 동작하지 않기 때문이다.

```javascript
for(var i=1; i<=5; i++){
    setTimeout(function(){
        console.log(i);
    }, i*1000);
}

// 6 6 6 6 6
```

위 코드의 의도는 1초 간격으로 1~5를 출력하는 예제이겠지만 `setTimeout()` 의 내부 **익명함수(Anonymous Function)**가사용하가 변수 `i` 가 해당 함수의 스코프 체인이 참조하는 전역변수 `i` 이기 때문에 반복문이 모두 끝났을 때 6이 들어가게 되고 결국 6을 1초 간격으로 5번 출력하게 되는 불상사가 일어난다. 이를 해결하기 위해선 global scope가 아닌 새로운 스코프를 생성해서 반복문을 도는 `i` 의 값들을 유지해야 한다.

```javascript
for(var i=1; i<=5; i++){
    (function(j){
        setTimeout(function(){
            console.log(j);
        }, j*1000);
    })(i);
}

// 1 2 3 4 5
```

**IIFE(Immediately Invoked Function Expression, 즉시실행함수 표현식)**를 사용하여 `i` 를 인자로 받는 함수를 구성한다면 새로운 렉시컬 스코프를 만들 수 있고 `setTimeout()` 은 각 반복마다의 `i` 값을 가지고 있는 변수 `j` 를 참조하여 원래 의도한대로 결과과 도출된다.

### Block Scoping

ES6(ES2015)에서 도입된 키워드로 `let` 이 있는데 이는 `var` 와는 다르게 block scoping을 가지는데 여기서 block의 의미는 `for`, `if`, `switch` 등에서 사용대는 `{}` 의 내부 영역을 의미한다. `let` 을 사용함으로써 기존에 함수를 스코프로 가지는 특성과 달라지기 때문에 위의 예시보다 클로저를 더 간단하게 사용할 수 있다.

```javascript
for(var i=1; i<=5; i++){
    let j = i;
    setTimeout(function(){
        console.log(j);
    }, j*1000);
}
```

`let` 이 `for` 문 안에서의 block scoping을 가지기 때문에 `j` 의 값은 반복과정에서 변하지 않고 각 반복에서의 `i` 값을 지니게 되는 방식이다. 이것 말고도 `let` 의 특징 중 반복할 때마다 그 이전 값으로 초기화되는 특징이 있기 때문에 이를 활용하여 더 간단하게 만들 수도 있다.

```javascript
for(let i=1; i<=5; i++){
    setTimeout(function(){
        console.log(i);
    }, i*1000);
}
```

### 특정 함수에 사용자가 정의한 객체의 메소드 연결하기

```javascript
function HelloFunc(func) {
  this.greeting = 'hello';
}

HelloFunc.prototype.call = function(func) {
  func ? func(this.greeting) : this.func(this.greeting);
};

var userFunc = function(greeting) {
  console.log(greeting);
};

var objHello = new HelloFunc();
objHello.func = userFunc;
objHello.call(); // hello
```

위 코드에서 `objHello` 는 생성자 함수인 `HelloFunc()` 에 의해 생성된 객체이며 해당 객체의 `func` 프로퍼티에 함수 `userFunc` 이 할당되었다. `objHello.call()` 이 실행되면 함수의 동작방식에 따라 `userFunc()` 을 호출하게 되는 구조이다. 하지만 여기서의 한계점은 `userFunc` 이 인자를 한개밖에 받지 않는다는 것이다. 이 때 인자를 더 받고 싶은데 활용할 수 있는 것이 바로 클로저이다.

```javascript
function saySomething(obj, methodName, name) {
  return (function(greeting) {
    return obj[methodName](greeting,name);
  });
}

function newObj(obj, name) {
  obj.func = saySomething(this, 'who', name);
  return obj;
}

newObj.prototype.who = function(greeting, name) {
  console.log(greeting + ' ' + (name || 'everyone'));
};

var obj = new newObj(objHello, 'haram');
obj.call(); // hello haram
```

`name` 이라는 변수를 더 넘기고 싶은 상황에서 새로운 생성자 함수인 `newObj()` 를 만들어 `obj.func` 에 클로저를 할당하면 `obj.call()` 을 호출할 때 클로저가 객체의 `who` 라는 메소드를 호출하게 되며 이로써 `name` 이라는 변수까지 사용할 수 있게 된다.



## 참조

* [https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch2.md](https://github.com/getify/You-Dont-Know-JS/blob/master/scope %26 closures/ch2.md)
* [https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch5.md](https://github.com/getify/You-Dont-Know-JS/blob/master/scope %26 closures/ch5.md)
* http://davidshariff.com/blog/javascript-scope-chain-and-closures/
* [인사이드 자바스크립트](http://www.yes24.com/Product/Goods/11781589?scode=032&OzSrank=1)

