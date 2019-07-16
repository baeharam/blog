---
title: "[Javascript] 객체지향 프로그래밍의 기본"
date: 2019-07-11T17:44:55+09:00
categories: ["Javascript"]
tags: ["Javascript","객제지향 프로그래밍"]
draft: false
---

## 캡슐화의 구현

기존의 객체지향 프로그래밍에서 **캡슐화(Encapsulation)**는 관련된 정보를 하나의 틀 안에 담는 개념, 즉 관련된 멤버 변수와 메소드를 클래스라는 틀 안에 담는 개념이다. 이때 중요한 것이 바로 해당 정보의 공개수준인데 **정보은닉(Information Hiding)**이라고 하며 보통 `private`, `public` 등으로 사용할 수 있다. 자바스크립트에선 캡슐화와 정보은닉을 클로저를 통해 구현할 수 있다.

```javascript
var Person = function(arg) {
  var name = arg ? arg : 'haram';
  var F = function(){}
  F.prototype = {
    setName: function(arg2) {
      name = arg;
    },
    getName: function() {
      return name;
    }
  };
  return F;
}();
```

IIFE를 통해서 클로저인 `F` 를 반환받고 `F.prototype` 에 있는 메소드들을 활용하여 `name` 에 접근할 수 있게 된다. 클로저의 특성 상 당연히 반환받은 `F` 로 `name` 에 접근할 수 없다는 점에서 `name` 은 `private` 멤버변수이고 `setName` 과 `getName` 은 `public` 메소드라고 볼 수 있다.



## 클래스의 구현

객체지향 프로그래밍 언어들은 클래스를 통해 인스턴스를 생성하는데 이를 자바스크립트에서 구현해보는 것은 자바스크립트의 객체지향 개념을 이해하는데 필수적이다. 이를 이해하고 구현하기 위해선 다음 것들을 활용해야 한다.

* 함수의 프로토타입 체인
* `extend` 함수 (객체 확장 함수)
* 인스턴스를 생성할 때의 생성자 호출 (`_init`)

클래스 역할을 하는 함수의 이름을 `subClass` 라고 하고 단계적으로 구현해보자.

### 부모 클래스 초기화

클래스를 생성할 때 처음 만드는 경우, 아니면 상속시키는 경우 둘 중 한가지인데 최상위 클래스가 `Function` 을 상속받기 때문에  `window` 객체와 구분해줘야 한다.

```javascript
var subClass = function(obj) {
  var parent = this===window ? Function : this;
  ...
}
```

### 생성자 초기화

생성자를 호출할 땐 자기 자신의 생성자와 부모의 생성자를 호출해야 하는데, 부모 클래스가 연쇄적으로 있을 경우라면 재귀적으로 이루어져야 한다.

```javascript
var subClass = function(obj) {
  ...
  var child = function() {
    var _parent = child.parent;
    if(_parent && _parent!==Function) {
      _parent.apply(this,arguments);
    }
    if(child.prototype._init) {
      child.prototype._init.apply(this,arguments);
    }
  }
  ...
}
```

갑자기 뭐가 많아져서 난해할 수 있지만 코드를 자세히 차근차근 보면 이해할 수 있다. `_parent` 는 현재 클래스의 부모 클래스를 말하여 부모 클래스가 존재하고 최상위 클래스인 `Function` 이 아니라면 부모 클래스의 생성자를 재귀적으로 호출한다. 그 다음으로 현재 클래스의 생성자가 존재하면 호출한다. 여기서 생성자가 클로저이기 때문에 `child` 의 값을 가지고 있다는 점을 알아야 이해할 수 있는데 해당 코드는 이후에 나온다.

### 프로토타입 체이닝을 이용한 클래스 기반 상속구현

이전 포스팅에서 프로토타입 기반 상속과 클래스 기반 상속에 대해서 살펴봤는데 여기선 함수객체를 매개체로 하는 클래스 기반 상속을 사용하였다.

```javascript
var subClass = function(obj) {
  ...
  function F() {}
  F.prototype = parent.prototype;
  child.prototype = new F();
  child.prototype.constructor = child;
  child.parent = parent;
  child.subClass = arguments.callee;
  ...
}
```

마지막 줄을 제외하고는 다 봤으니 마지막 줄이 어떤 말인지 알아보자. `arguments.callee` 라는 것은 호출된 함수를 지칭하는 것으로 여기선 `subClass` 를 말하는데 이를 현재 클래스의 `subClass` 프로퍼티에 추가하는 것은 현재 클래스를 부모 클래스로 갖는 자식 클래스 또한 만들 수 있기 때문이다. 따라서 메소드로 추가해놓고 연쇄적으로 사용하는 목적이라고 볼 수 있다.

### extend() 의 구현

깊은 복사를 적용하지 않고 얕은 복사로만 간단히 구현해 보면 다음과 같다.

```javascript
var subClass = function(obj) {
  ...
  for(var prop in obj){
    if(obj.hasOwnProperty(prop)) {
      child.prototype[prop] = obj[prop];
    }
  }
  return child;
}
```

### 상속 최적화

상속을 구현할 때 함수객체 `F` 를 사용하였는데 이는 `subClass()` 를 호출할 때마다 생성되어 메모리에 올라가게 된다. 비효율적이기 때문에 이를 한번만 생성하고 클로저로 사용하기로 하자.

```javascript
var subClass = function(obj) {
  function F() {}
  var subClass = function(obj) {
    ...
    return child;
  };
  return subClass;
}();
```

IIFE를 활용하면 `subClass` 가 바로 클로저를 받아낼 수 있다.



## 참조

* [인사이드 자바스크립트](http://www.yes24.com/Product/Goods/11781589?scode=032&OzSrank=1)

