---
title: "[JS] 자바스크립트는 어떻게 동작할까?"
date: 2019-09-28T16:43:33+09:00
categories: ["Javascript"]
tags: ["Javascript", "Call stack", "Event loop", "Callback queue"]
draft: false
---

[What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ) 영상을 보고 정리한 글이다.

강연자가 JS를 정의할 때 다음과 같이 설명한다.

> **" 자바스크립트는 싱글 쓰레드 기반이며 논 블로킹 방식의 비동기적인 동시성 언어이며 콜 스택, 이벤트 루프와 콜백 큐 그리고 여러가지 다른 API들을 가지고 있다. "**

참 특징이 많은 언어인데 이렇게 보면 도대체 어떤 언어인지 알 수가 없다. 그렇다면 JS의 엔진인 V8에게 콜 스택, 이벤트 루프나 콜백 큐를 가지고 있는지 물어보자. 그럼 다음과 같이 대답한다. 

> **" 저는 콜 스택과 힙을 가지고 있는데 다른 건 도대체 뭡니까?? "**

그렇다면 V8이 말하는 콜 스택과 힙은 무엇을 의미할까? 여기서 힙은 메모리가 할당되는 부분이고 콜 스택은 함수가 호출될 때 execution context가 쌓이는 영역이다. 여기선 모두 다루지 않고 콜 스택, 이벤트 루프 그리고 콜백 큐에 대해 다루기 때문에 힙에 관한 정리는 다음에 하도록 한다. 먼저 콜 스택에 대해 알아보자.

## 콜 스택(Call Stack)

먼저 전체적인 개관의 그림을 살펴보면 아래와 같이 표현할 수 있다.

<img src="/images/javascript/how/overview.png" class="center" width="600px">

그림을 보게 되면, V8이 가지고 있는 힙과 콜스택이 있고 웹 브라우저에서 제공하는 Web API가 DOM, Ajax, setTimeout 등을 제공하는 것을 알 수 있다. 또한 JS를 공부하는 사람이라면 들어봤을 만한 이벤트 루프와 콜백 큐가 있다. 자 이제 콜스택에 대해 알아보자.

> **하나의 쓰레드 = 하나의 콜 스택 = 한번에 하나의 작업**

JS는 모두가 알다시피, 싱글 쓰레드 언어이며 위와 같이 한번에 하나의 코드를 실행할 수 있다는 것을 뜻한다. 이는 곧 한번에 하나의 콜 스택을 가질 수 밖에 없다는 것을 말한다. 아래 코드를 통해서 더욱 자세히 살펴보자.

```javascript
function multiply(a,b) {
  return a*b;
}

function square(n) {
  return multiply(n,n);
}

function printSquare(n) {
  var squared = square(n);
  console.log(squared);
}

printSquare(4);
```

제곱해서 출력해주는 아주 기본적인 함수이다. 여기서 콜 스택을 보게 되면,

<img src="/images/javascript/how/callstack1.png" class="center" width="300px">

호출한 순서대로 쌓이는 것을 알 수 있다. (제일 처음에 실행할 때는 메인함수의 execution context가 추가되는 것을 기억하자.) 이런 방식이 기본적인 콜 스택이며 웹 브라우저에서 에러가 발생했을 때 그때까지의 호출순서를 보여주는 것도 콜 스택을 통해서 하는 것이다. 만약 콜 스택을 재귀함수로 호출하게 되면 아래와 같은 경고문구가 나오면서 종료된다.

> **RangeError: Maximum call stack size exceeded!!**

이제 어느정도 콜 스택에 대해 살펴보았으니 blocking이 도대체 뭔지 알아보도록 하자.

## 블로킹(Blocking)

Blocking에 대한 정확한 정의는 없지만 **"느리게 동작하는 코드**" 로 정의할 수 있다. 즉, 콜 스택에 현재 느리게 동작하는 작업이 남아있는 것을 말한다. 대표적인 예시로 네트워크 요청 혹은 이미지 프로세싱 등이 있다. 다음 코드를 보자.

```javascript
var foo = $.getSync('//foo.com');
var bar= $.getSync('//bar.com');
var qux = $.getSync('//qux.com');

console.log(foo);
console.log(bar);
console.log(qux);
```

jQuery를 통해서 동기적으로 네트워크 요청을 3번 하는 코드이며 다음과 같이 콜 스택이 진행된다.

<img src="/images/javascript/how/callstack2.png" class="center" width="600px">

네트워크 요청은 느린 작업이기 때문에 다음 작업이 곧장 실행되지 않고 현재 진행되는 작업이 끝날 때까지 기다린 후에 다음 작업이 실행되고 있다. 이 방식이 문제가 되는 이유는 바로 코드가 웹 브라우저에서 실행되고 있기 때문이다. 느린 작업으로 인해 blocking이 발생하게 되면 웹 브라우저는 렌더링을 하지 못하고 다른 코드 또한 실행할 수 없게 된다. 즉, 사용자의 경험을 막게 된다. 따라서 다른 방식을 통해서 다음과 같은 작업을 해결해야 하는데 그걸 위한 것이 바로 **"비동기 콜백"** 이다. 

## 비동기 콜백(Asynchronous Callback)

일반적으로 비동기 콜백을 설명할 때 가장 많이 사용하는 함수가 바로 `setTimeout` 이다. 주어진 시간만큼 기다렸다가 콜백함수를 실행하는 이 함수는 JS엔진인 V8에 내장되어 있지 않고, 웹 브라우저에서 제공하는 Web API에 존재한다. 아래 코드를 보면서 비동기 콜백이 어떻게 이루어지는지 확인하자.

```javascript
console.log('First Stack');
setTimeout(function callback(){
  console.log('Asynchronous Callback');
}, 3000);
console.log('Second Stack');
```

지금까지 배운 콜 스택의 개념을 활용하면 콜 스택에 차례대로 쌓일 것 같지만, V8의 소스코드에는 `setTimeout` 함수가 없기 때문에 웹 브라우저가 대신 실행해주어야 한다. 여기서 바로 **"동시성"** 개념이 나온다. 즉, JS가 싱글 쓰레드 기반임에도 불구하고 동시성 언어라고 부르는 이유는 웹 브라우저가 제공하는 API를 통해 동시에 작업을 할 수 있기 때문이다. 이걸 그림으로 보면 다음과 같다.

<img src="/images/javascript/how/async callback1.png" class="center" width="600px">

처음엔 순서대로 쌓이다가 `setTimeout` 함수를 웹 브라우저에게 맡기고 두 번째 `log` 를 쌓는다. 따라서 아래와 같이 먼저 출력되는 것이다.

```
First Stack
Second Stack
```

이제 콜 스택에서 `main()` 을 제외한 모든 함수가 리턴되고 Web API의 `setTimeout` 타이머가 종료되면 해당 콜백이 콜백 큐로 전달된다. 이제 여기서 이벤트 루프의 역할이 나오는데 이벤트 루프는 콜 스택과 콜백 큐를 감시하는 역할로 콜백 큐에 함수가 존재하고 콜 스택이 비었다면 콜백 큐에서 콜백을 꺼내 콜 스택에 넣어주는 역할을 한다. 아래와 같이 동작하는 것이다.

<img src="/images/javascript/how/async callback2.png" class="center" width="600px">

이런 것을 활용하는 트릭이 있는데, 어떤 코드를 바로 실행시키지 않고 특정하게 순서를 조정하고 싶을 때 다음과 같이 할 수 있다.

```javascript
console.log('First Stack');
setTimeout(() => console.log('Third Stack'), 0);
console.log('Second Stack');
```

```
First Stack
Second Stack
Third Stack
```

이것이 가능한 이유는 웹 브라우저가 담당했다가 콜백 큐로 가고 그 다음에 이벤트 루프가 콜백 큐에서 콜 스택으로 옮기는 과정을 거치기 때문이다. 따라서 `setTimeout` 을 연속으로 호출하는 경우 또한 기대하는 지연 시간과 다른 값이 나올 수 있다.

## 2가지 콜백

지금까지 설명한 것들을 통해서 콜백 함수를 2가지로 정의할 수 있다.

* **함수가 호출하는 다른 콜백 함수**
* **비동기적으로 호출되는 콜백 함수**

강연자가 만든 [사이트](http://latentflip.com/loupe) 를 가서 아래 코드를 동작시켜보면, 좀더 명확하게 2가지 콜백이 어떻게 다른지 알 수 있다.

```javascript
// Synchronous
[1,2,3,4].forEach(function(i) {
   console.log(i); 
});

// Asynchronous
function asyncForEach(array, cb) {
    array.forEach(function(){
       setTimeout(cb, 0); 
    });
}
asyncForEach([1,2,3,4], function(i){
    console.log(i); 
});
```

둘 다 `forEach` 를 사용하지만 첫번째의 경우는 계속 콜 스택에 쌓이는 방식이고 두 번째의 경우는 트릭을 써서 Web API를 활용해 콜백 큐로 이동시켰다가 이벤트 루프를 통해 콜 스택으로 옮기는 방식이다.

## 비동기 콜백을 통한 블로킹 완화

기본적인 콜백 방식의 문제점은 웹 브라우저의 렌더링을 못하게 하여 UI를 블로킹 시키는데 있다고 했다. 웹 브라우저는 1초에 60 프레임을 다시 그리는게 가장 이상적인 경우인데, 렌더링 또한 콜백 처럼 작용해서 콜 스택에 들어가게 된다. 하지만 콜 스택에서 어떤 작업이 지연되고 있을 경우 렌더링을 못한다. 따라서, 느린 작업이 동기적으로 콜 스택에 있게 되면 렌더링을 못하게 되고 그에 따라 UI가 블로킹 되는 현상이 발생하는 것이다. **렌더링을 할 때는 렌더 큐(Render Queue) 또한 존재해서 이벤트 루프가 콜백 큐를 감시하는 것과 비슷한 방식으로 콜 스택이 비었을 경우 렌더링을 시도한다.** 비동기 콜백으로 작업을 실행하게 되면 콜 스택이 비는 때가 존재하기 때문에 렌더링이 될 수 있는 틈을 준다. 이것이 바로 비동기 콜백을 사용하는 이유이다.

## 마무리하며...

이제까지 콜 스택, 콜백 큐 그리고 이벤트 루프와 렌더 큐 까지 알아보았는데 자바스크립트의 핵심 원리에 조금이나마 근접할 수 있어서 뭔가 개운했다. 강연자의 강의는 굉장히 깔끔하고 명확하며 한국어 자막까지 제공되기 때문에 자바스크립트 개발자라면 한번 쯤은 봐야하는 강의라고 생각된다. 앞으로 동기/비동기 코드를 짤 때는 이번에 배운 것들에 대해서 인지하고 이를 통해 원리에 입각하여 짤 수 있도록 노력해야겠다.