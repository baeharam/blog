---
title: "[Javascript] Inheritance"
date: 2019-07-10T15:39:39+09:00
categories: ["Javascript"]
tags: ["Javascript","Inheritance","Prototype","자바스크립트","상속","프로토타입"]
draft: false
---

자바스크립트는 클래스 기반의 언어가 아닌 프로토타입 기반의 언어로 클래스 기반 언어에서의 상속을 구현하기 위해선 프로토타입의 특성을 활용해야 한다. 이를 사용해서 프로토타입 기반의 상속과 클래스 기반의 상속을 구현해낼 수 있다.

## 프로토타입 기반의 상속

### 공통 메소드

생성자 함수를 통해서 객체를 생성할 수 있는데, 이렇게 생성해낸 객체가 공통의 메소드를 가지게 하기 위해선 어떻게 해야할까? 직관적인 방법으로 생성자 함수 내에 메소드를 정의하면 그로 인해 생성되는 객체는 당연히 해당 메소드를 공통으로 가지게 된다. 하지만 이는 불필요하게 중복되는 영역을 메모리에 올려놓는 형태이므로 프로토타입을 사용해야 한다. 프로토타입을 활용하면 메소드를 위한 함수객체의 중복생성을 방지하면서 프로토타입 체인을 통해 공통 메소드에 접근할 수 있다.

```javascript
function Person(arg) {
  this.name = arg;
}

Person.prototype.getName = function() {
  return this.name;
}

Person.prototype.setName = function(arg) {
  this.name = arg;
}

var me = new Person('me');
var you = new Person('you');
console.log(me.getName()); // me
console.log(you.getName()); // you
```

이를 좀더 간단하게 표현하기 위해 더글라스 크락포드가 제시한 방식을 사용하면 `Function` 객체의 프로퍼티에 메소드를 정의하는 메소드를 추가하는 방법이 있다.

```javascript
Function.prototype.method(name, func) {
  if(!this.prototype[name]) {
    this.prototype[name] = func;
  }
}
```

이를 활용하면 `Person.method('setName', function…)` 과 같이 사용할 수 있어서 조금 더 간결해진다.

### 부모 객체의 메소드 상속

이제 이 개념을 기억하고 프로토타입 기반의 상속을 구현해보자. 더글라스 크락포드가 오래전에 제시한 상속 구현코드를 보면서 구현해보도록 하자.

```javascript
function createObj(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

var parent = {
  name: 'parent',
  setName: (name) => this.name = name,
  getName: () => this.name
};


var child = createObj(parent);
child.setName('child');
console.log(child.getName()); // child
```

먼저 빈 생성자 함수객체 `F()` 를 만든 뒤 `prototype` 을 매개변수로 전달받은 객체로 선언한다. 이 말은 곧 새로 생성할 객체의 부모객체가 `obj` 가 된다는 말과 동일하며 생성자 함수를 통해 객체를 생성하여 리턴한다.  결국 `F()` 를 매개체로 하여 프로토타입을 통해 상속을 구현했다고 할 수 있다. 여기서 `createObj()` 와 같은 함수는 ES5에서 `Object.create()` 로 제공된다.

### 자식 객체의 메소드 확장

부모 객체의 메소드를 재정의하거나 아니면 자신만의 메소드를 구현하여 확장할 수 있어야 하는데 이 때 사용하는 함수가 자바스크립트에서 범용적으로 사용하는 `extend()` 이다. 이는 기본적으로 아래와 같이 구현된다. (jQuery 1.0의 구현)

```javascript
function extend(obj1, obj2) {
  if(!obj2) {
    obj2 = obj1;
    obj1 = this;
  }
  for(var prop in obj1) {
    obj1[prop] = obj2[prop];
  }
  return obj1;
}
```

`obj1` 에 `obj2` 를 추가하는 함수로 만약 `obj2` 가 없을 경우엔 `this` 에 `obj1` 을 추가하는 방식이다. 이는 간단하긴 하지만 **얕은복사(Shallow Copy)**만 가능할 뿐 객체나 배열의 프로퍼티를 추가하면 해당 참조값이 추가되기 때문에 배열과 객체에 한해서는 **깊은복사(Deep Copy)**를 구현해야 한다. jQuery의 [core.js](https://github.com/jquery/jquery/blob/438b1a3e8a52d3e4efd8aba45498477038849c97/src/core.js) 120번째 줄을 보면 `extend()` 의 보완된 구현이 있으니 더 깊은 내용은 해당 소스코드를 보도록 하자. 단순히 위 함수를 활용한 예시를 보면,

```javascript
...
var forExtend = {
  setAge: (age) => this.age = age,
  getAge: () => this.age
};
child.extend(forExtend);
child.setAge(10);
console.log(child.getAge()); // 10
```

새로운 객체 리터럴인 `forExtend` 를 정의하여 이를 `extend()` 로 `child` 에 추가시킨 코드이다. 이를 통해 `child` 는 부모 객체의 메소드 뿐만 아니라 자신의 확장된 메소드 또한 사용할 수 있게 된다.



## 클래스 기반의 상속

### 부모 객체를 활용한 상속

이 방법 또한 프로토타입 기반의 상속과 비슷하긴 하지만 생성자 함수로 생성한 객체를 프로토타입으로 가진다는 점이 다르다고 할 수 있다. 아래와 같은 코드를 보자.

```javascript
function Parent(name) {
    this.name = name;
}

Parent.prototype.setName = function(name) {
    this.name = name;
}
Parent.prototype.getName = function(){ 
    return this.name;
};

function Child() {
    Parent.apply(this,arguments);
}

var parent = new Parent('parent');
Child.prototype = parent;

var child = new Child('child');
console.log(child.getName());
```

생성자 함수인 `Parent()` 를 통해서 객체 `parent` 를 생성하고 자식의 생성자 함수인 `Child()` 의 `prototype` 으로 `parent` 를 설정한 상황이다. 따라서 `child.getName()` 을 호출할 때 프로토타입 객체인 `parent` 를 거치고  `parent` 의 프로토타입 객체인 `Parent.prototype` 까지 가서 호출하게 된다.

여기서 주목할 점은 생성자 함수인 `Child()` 에서 부모객체의 생성자 함수인 `Parent()` 를 `apply` 메소드로 호출한다는 점인데 이는 기존의 클래스 기반 언어에서 당연하게 적용되는 부모생성자의 호출과 동일한 맥락이라고 볼 수 있다.

### 자식 객체의 확장을 위한 개선

자식의 프로토타입 객체인 `parent` 에 메소드를 추가하게 되면 해당 객체 자체에 메소드가 추가되는 것이므로 `parent` 와 `child` 를 독립적으로 분리시킬 필요성이 있다. 이를 위해 빈 생성자 함수 객체를 활용하여 다음과 같이 구현한다.

```javascript
function Parent(name) {
  this.name = name;
}

Function.prototype.method(name, func) {
  this.prototype[name] = func;
}

Parent.method('setName', function(name) {
	this.name = name;
});

Parent.method('getName', function() {
  return this.name;
});

function Child() {}

function F() {}
F.prototype = Person.prototype;
Child.prototype = new F();
F.prototype.constructor = Child;
Child.super = Person.prototype;

var child = new Child();
child.setName('child');
console.log(child.getName()); // child
```

이제 `child` 는 생성자 함수 `F()` 로 생성된 객체를 프로토타입 객체로 가지며 프로토타입 체인을 통해서 메소드를 호출하게 된다. 또한 이제 자식객체의 프로토타입을 통해 확장시킬 수도 있게 된다. 스토얀 스테파노프가 위 코드를 클로저로 최적화시켜 `F()` 가 한번만 생성되도록 한 것이 바로 다음과 같다.

```javascript
var inherit = function(Parent, Child) {
  var F = function() {};
  return function(Parent,Child) {
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.super = Parent.prototype;
  };
}();
```



## 참조

* [인사이드 자바스크립트](http://www.yes24.com/Product/Goods/11781589?scode=032&OzSrank=1)