---
title: "[jQuery] jQuery 1.0 소스코드 분석 (3)"
date: 2019-07-17T18:44:04+09:00
categories: ["jQuery"]
tags: ["jQuery", "1.0"]
draft: true
---

## jQuery.event.add()

```javascript
function(element, type, handler) {
			...
			// Make sure that the function being executed has a unique ID
			if ( !handler.guid )
				handler.guid = this.guid++;
  		...
}
```

* `element` : id에 해당하는 DOM 객체
* `type` : 'click' 이벤트 타입
* `handler` : 해당 이벤트에 대한 콜백 함수

위의 인자로 넘어온 상황에서 콜백함수인 `handler` 의 프로퍼티에 `guid` 가 없다면 동적으로 만들고 `this.guid` 로 초기화한다. 여기서 `this` 는 `jQuery.event` 객체이며 초기값으로 `guid: 1` 을 갖는다.

```javascript
// Init the element's event structure
if (!element.events)
  element.events = {};
```

DOM 객체에 `events` 프로퍼티가 없다면 동적으로 생성한다음 객체 리터럴로 초기화한다. 이는 DOM 객체의 `events` 객체를 통해 이벤트들을 관리하기 위함이다.

```javascript
// Get the current list of functions bound to this event
var handlers = element.events[type];
```

`events` 객체의 프로퍼티 중 `'click'` 에 해당하는 객체가 존재하는지 확인하기 위해 변수 `handlers` 에 할당한다.

```javascript
// If it hasn't been initialized yet
if (!handlers) {
  // Init the event handler queue
  handlers = element.events[type] = {};

  // Remember an existing handler, if it's already there
  if (element["on" + type])
    handlers[0] = element["on" + type];
}
```

만약 정의되어 있지 않다면 객체 리터럴로 초기화한다. 이는 역시 이벤트들 중에서도 타입 별로 관리한다는 뜻이다. 그 다음으로 DOM 객체의 프로퍼티 중에 `'on'` 이 붙은 이벤트 타입의 프로퍼티를 보는데 만약 존재한다면 `handlers` 의 첫번째 인덱스에 초기화시킨다. 이건 jQuery가 DOM 객체에 미리 설정된 이벤트 핸들러 값이 있다면 전달받은 핸들러를 단순히 이벤트 타입 객체의 안쪽으로 이동시킨다는 것을 말한다.

```javascript
// Add the function to the element's handler list
handlers[handler.guid] = handler;

// And bind the global event handler to the element
element["on" + type] = this.handle;
```

전달받은 콜백함수를 `handlers` 에 넣어주고 마지막으로 DOM 객체의 이벤트 핸들러를 `this.handle` 로 설정한다. 여기서 `this` 는 `jQuery.event` 객체이므로 `jQuery.event.handle()` 메서드를 말하는 것이다. 따라서 jQuery에서 등록한 이벤트가 발생하면 `jQuery.event.handle()` 메서드만 호출한다는 것을 알 수 있다. 이는 `events` 객체 내부에서 각 이벤트 타입별로 관리하기 때문이다. 이제 이 메서드가 어떻게 동작하는지 알아보자.

## jQuery.event.handle()

```javascript
function(event) {
  ...

  var returnValue = true;
  var c = this.events[event.type];

  for ( var j in c ) {
    if ( c[j].apply( this, [event] ) === false ) {
      event.preventDefault();
      event.stopPropagation();
      returnValue = false;
    }
  }

  return returnValue;
}
```

jQuery는 DOM 이벤트가 발생하면 이 메서드를 실행하기 때문에 해당 메서드 안에서의 `this` 는 DOM 객체임을 알 수 있다. 따라서 `c` 에 할당되는 것은 DOM 객체의 `events` 객체 내부에 `'click'` 프로퍼티로 정의된 객체이다. 해당 객체의 프로퍼티를 순회하는데 프로퍼티는 상수(`guid`) 이고 프로퍼티 값들이 콜백함수이므로 콜백함수에 명시적으로 DOM 객체를 바인딩 시켜서 호출한다는 것을 알 수 있다. 그렇게 호출을 하고 호출결과에 따라 리턴값이 반환된다.

## jQuery 이벤트 핸들러는 동시에 등록할 수 있다.

위의 동작을 보면 알다시피 DOM 객체의 속성으로 `onclick` 으로 이벤트 핸들러를 등록하면 `events` 의 내부객체 중 일치하는 타입에 해당하는 객체의 프로퍼티 0에 해당 핸들러가 등록된다. 그 다음으로 `click()` 과 같은 메서드를 사용할 경우 `guid` 가 프로퍼티가 되서 등록됨을 알 수 있다. 따라서 여러개를 등록하면 방금 위에서 본 `jQuery.event.handle()` 메서드를 통해서 등록된 이벤트 핸들러들을 순회하면서 호출하는 방식이며 0부터 호출되기 때문에 `onclick` 으로 등록된 이벤트 핸들러가 가장 먼저 호출되는 구조이다.

## 참조

* [인사이드 자바스크립트](http://www.yes24.com/Product/Goods/11781589?scode=032&OzSrank=1)