---
title: "[Javascript] Execution Context"
date: 2019-07-10T09:27:48+09:00
categories: ["Javascript"]
tags: ["Javascript","Execution Context","자바스크립트","실행 컨텍스트"]
cover: "images/cover/javascript.jpeg"
draft: false
---

## 정의

ECMAScript 에서 정의하는 EC(Execution Context)는 다음과 같이 표현한다.

> *Execution context (abbreviated form — EC) is the abstract concept used by ECMA-262 specification for typification and differentiation of an executable code.*
>
> *실행 컨텍스트는 실행가능한 코드를 형상화하고 구분하는 추상적인 개념이다.*

즉, EC는 자바스크립트 엔진이 코드를 실행할 때 생성되는 하나의 환경(environment)이라고 할 수 있다.

## 종류

* **전역 실행 컨텍스트 (Global Execution Context, GEC)**

GEC는 브라우저에서 자바스크립트를 처음 로드할 때 생성되는 EC로 어떠한 함수나 객체에도 속하지 않고 전역공간에 놓인 모든 코드들이 속하는 EC이다. 자바스크립트는 싱글 스레드 기반의 언어이기 때문에 GEC는 1개만이 생긴다. EC가 생성될 때 EC들은 자바스크립트의 논리적 스택구조인 Execution Stack에 쌓이게 되는데 가장 먼저 쌓이는 EC가 바로 GEC이다.

* **함수 실행 컨텍스트 (Functional Execution Context, FEC)**

자바스크립트 엔진은 함수가 실행될 때마다 해당 함수에 맞는 EC를 생성하는데 이를 FEC라고 하며 FEC는 반드시 Execution Stack에서 GEC 이후에 쌓이게 된다.

* **Eval 함수 실행 컨텍스트 (Eval Function Execution Context)**

자바스크립트에선 `eval()` 함수를 사용하여 문자열 형태로 코드를 실행할 수 있는데 이 또한 EC를 생성함을 알아두자.

## Execution Context Stack

<img src="/images/javascript/ec/ec1.png" width="400px">

자바스크립트 엔진은 코드를 실행하자마자 GEC를 스택에 푸시하고 함수 호출을 만날 때마다 해당 함수가 만드는 FEC를 스택에 푸시하게 된다. 함수가 종료되면 해당 스택에서 FEC가 제거되며 모든 코드가 실행되고 끝날 경우 엔진이 GEC를 제거하고 마치게 되는 구조이다.

## 생성되는 과정

자바스크립트 엔진이 EC를 생성하는 과정은 2가지 단계로 이루어진다.

### 생성단계(Creation Phase)

생성단계에선 엔진이 코드를 컴파일하는 과정으로 함수를 호출하긴 하지만 아직 그 내부의 코드를 스캔만 하지 실행하는 단계가 아니다. 이 때 엔진은 다음과 같은 일을 수행한다.

* **스코프 체인(Scope Chain, SC)의 생성과 초기화**

스코프 체인은 모든 함수가 가지는 속성인 `[[Scopes]]` 로 참조되는 연결리스트 형태로 현재 EC의 활성객체를 가리키고 있으며 순차적으로 상위 스코프의 활성객체를 가지는 형태이다. 스코프 체인은 변수를 검색하는 메커니즘으로 해당 스코프체인의 처음부터 변수를 검색하며 리스트를 순회하는 방식이다.

* **활성객체(Activation Object, AO)의 생성**

활성객체는 현재 활성화된 EC에 활성객체는 함수가 인자로 전달받는 `arguments` 객체, 변수, 내부 함수를 가지는 객체로 엔진이 EC를 생성할 때 가장 먼저 생성하는 객체이다. 하지만 보통의 객체와는 다르게 `prototype` 속성이 없으며 코드로 접근할 수 없다. 해당 활성객체는 변수객체(Variable Object, VO)로 참조되는데 이는 FEC에선 맞지만 GEC에선 활성객체가 존재하지 않고 변수객체가 전역객체(Global Object, GO)를 참조함을 기억하자. ([참조]([https://poiemaweb.com/js-execution-context#21-variable-object-vo--%EB%B3%80%EC%88%98%EA%B0%9D%EC%B2%B4](https://poiemaweb.com/js-execution-context#21-variable-object-vo--변수객체)))

* `this` **객체 바인딩**

스코프 체인이 초기화 된 후에 엔진은 `this` 객체를 바인딩시킨다.

### 실행단계(Execution Phase)

생성단계를 거치고 실행에 필요한 정보들이 만들어진 상태에서 실행단계에 오면 실제로 변수에 값이 할당되게 된다.

```javascript
function func(pass) {
  var a = 1;
  var b = function innerExpression(){}
  function innerDeclaration(){}
}
func(1);
```

위와 같은 코드가 생성단계를 지나면 `func` 의 EC는 아래와 같이 된다.

```
funcExectuionContext = {
	Scope Chain,
	Activation Object = {
		arguments = {
			0: 1
			length: 1
		},
		pass: 1,
		a: undefined,
		b: undefined,
		innerDeclaration: reference to innerDeclaration
	}
}
```

여기서 주목할 점은 `arguments` 객체가 유사배열객체(Array-like Object)라는 것, 함수 선언문(Function Declaration)이 초기화까지 된다는 것이다. 유사배열객체란 `length` 값을 가지는 객체로 배열과 같은 구조로 되어있지만 배열의 메소드를 사용할 수 없는 객체를 말한다. 또한 함수 선언문이 초기화까지 되는 것은 곧 나올 호이스팅(Hoisting)과 연관이 있다. 이제 실행단계를 거치게 되면 아래와 같이 된다.

```
funcExectuionContext = {
	Scope Chain,
	Activation Object = {
		arguments = {
			0: 1
			length: 1
		},
		pass: 1,
		a: 1,
		b: reference to innerExpression,
		innerDeclaration: reference to innerDeclaration
	}
}
```

모든 변수에 대해 할당과정도 끝남을 알 수 있다.

## 호이스팅(Hoisting)

호이스팅은 "끌어올리다" 라는 뜻으로 특정 변수나 함수를 선언전에도 사용할 수 있게끔 되는 현상을 말한다. 이는 EC의 생성단계를 보면 알 수 있는데 변수 호이스팅과 함수 호이스팅이 있다.

### 변수 호이스팅

변수 호이스팅은 변수를 선언하기 전에 사용할 수 있는 현상으로 [변수의 선언처리](https://poiemaweb.com/js-execution-context#3122-변수-x의-선언-처리) 에 의해 초기화 과정에서 메모리에 변수를 등록할 때 `undefined` 로 값이 할당되기 때문에 선언전에 사용할 수 있게 되는 것이다.

### 함수 호이스팅

함수 호이스팅이 적용되는 함수의 정의는 함수 표현식(Function Expression)이 아닌 **함수 선언문**으로 변수객체가 가리키는 활성객체에 함수객체의 값이 프로퍼티로 할당된다. 이를통해 함수 선언문도 그 선언전에 사용할 수 있게 되는 것이다.

따라서 위의 호이스팅들이 모두 적용되어 아래와 같은 코드가 가능하게 된다.

```javascript
console.log(a); // undefined
func(2); // 2

var a;
function func(i) {
  console.log(i);
}
```

## 참조

* https://poiemaweb.com/js-execution-context
* https://blog.bitsrc.io/understanding-execution-context-and-execution-stack-in-javascript-1c9ea8642dd0
* http://davidshariff.com/blog/what-is-the-execution-context-in-javascript/
* https://hackernoon.com/execution-context-in-javascript-319dd72e8e2c
* [https://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262,%203rd%20edition,%20December%201999.pdf](https://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262, 3rd edition, December 1999.pdf)
* http://dmitrysoshnikov.com/ecmascript/chapter-1-execution-contexts/
* http://jibbering.com/faq/notes/closures/#clExCon

