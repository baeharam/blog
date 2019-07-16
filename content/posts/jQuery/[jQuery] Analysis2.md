---
title: "[jQuery] jQuery 1.0 소스코드 분석 (2)"
date: 2019-07-16T20:10:26+09:00
categories: ["jQuery"]
tags: ["jQuery","1.0"]
cover: ""
draft: false
---

## this.get()

여기서의 `this` 는 새로 생성할 `jQuery` 객체에 바인딩 되기 때문에 메서드 `get()` 은 `jQuery.prototype.get()` 을 말한다. 따라서 해당 소스코드를 봐야 한다.

```javascript
function( num ) {
  // Watch for when an array (of elements) is passed in
  if ( num && num.constructor == Array ) {

    // Use a tricky hack to make the jQuery object
    // look and feel like an array
    this.length = 0;
    [].push.apply( this, num );

    return this;
  } else
    return num == undefined ?

      // Return a 'clean' array
      jQuery.map( this, function(a){ return a } ) :

    // Return just the object
    this[num];
}
```

매개변수인 `num` 은 `find()` 의 리턴값인 DOM 객체의 배열이기 때문에 if 문이 참이 되어 들어간다. 여기서 주의깊게 봐야 하는데, `this.length` 의 값을 0으로 초기화시키는 것은 생성되는 `jQuery` 객체를 유사배열객체로 만들기 위함이며 배열 리터럴을 통해서 `apply` 를 호출하는데 이는 `Array.prototype` 의 메서드인 `push()` 를 호출하기 위함이다. 이를 통해 유사배열객체인 `this` 에는 `num` 이 들어가게 된다. 원소가 추가됐으므로 `length` 의 값은 1이 되고 해당 객체를 리턴한다.

## 다시 jQuery() 로..

이제 부가적인 코드를 봤으니 원래대로 돌아와서 `jQuery` 의 나머지 부분을 보자.

```javascript
// See if an extra function was provided
var fn = arguments[ arguments.length - 1 ];

// If so, execute it in context
if ( fn && fn.constructor == Function )
  this.each(fn);
```

`arguments` 객체의 마지막 값, 즉 여기선 `new jQuery(a,c)` 를 호출했기 때문에 `c` 인데 `undefined` 이므로 넘어가고 밑의 if 문도 넘어가게 된다. 생성자 함수에서 리턴 값이 없을 경우 새로 생성된 객체가 리턴되기 때문에 id가 `'jq'` 인 DOM 객체를 가진 `jQuery` 객체가 리턴된다.

## $('#jq').text()

이제 `jQuery` 객체가 id를 통해서 어떻게 생성되는지 파악했으니 `jQuery.prototype` 에 정의되어 있는 표준 메서드 `text()` 를 보도록 하자.

```javascript
function(e) {
  e = e || this;
  var t = "";
  for ( var j = 0; j < e.length; j++ ) {
    var r = e[j].childNodes;
    for ( var i = 0; i < r.length; i++ )
      t += r[i].nodeType != 1 ?
        r[i].nodeValue : jQuery.fn.text([ r[i] ]);
  }
  return t;
}
```

여기선 `jQuery` 객체로 호출했기 때문에 `e` 에 `jQuery` 객체가 할당되고 유사배열객체이므로 위와 같이 순회할 수가 있다. `e` 를 순회하면서 가지고 있는 DOM 객체의 자식 노드들에 대해서 다시 순회를 하는데 자식 노드가 `ELEMENT_NODE` 가 아니라면 값을 `t` 에 더해주고 맞다면 해당 노드를 배열 리터럴로 만들어 재귀함수를 호출한다. 여기선 `<div id="jq">good</div>` 라고 했을 때 `TEXT_NODE` 이므로 `t` 에 "good"을 더하게 된다. 자식이 1개밖에 없기 때문에 "good"을 리턴한다.

## 이벤트 메서드의 정의

이제 jQuery에서 이벤트 핸들링을 어떻게 다루는지 살펴보기 위해서 이벤트 메서드가 어떤 방식으로 정의되는 지 보아야 한다.

```javascript
new function(){

	var e = ("blur,focus,load,resize,scroll,unload,click,dblclick," +
		"mousedown,mouseup,mousemove,mouseover,mouseout,change,reset,select," + 
		"submit,keydown,keypress,keyup,error").split(",");

	// Go through all the event names, but make sure that
	// it is enclosed properly
	for ( var i = 0; i < e.length; i++ ) new function(){
			
		var o = e[i];
		
		// Handle event binding
		jQuery.fn[o] = function(f){
			return f ? this.bind(o, f) : this.trigger(o);
		};
    
    .....
}
```

DOM의 이벤트 타입을 `e` 에 다 넣어놓고 돌면서 각각의 함수를 바인딩시키는 구조이다. 여기서 이상한 점은 함수를 호출하지 않았다는 것인데 이건 `new` 연산자의 특징으로 인자가 없는 **생성자 함수를 호출할 경우 괄호를 생략할 수 있다.** 따라서 위 함수는 IIFE와 동일한 방식으로 함수 호출을 한 것이라고 보면 된다.

각 이벤트 타입들을 돌면서 `jQuery.fn` 객체의 프로퍼티로 해당 이벤트를 설정하여 함수를 할당한다. 근데 이 때 `bind()` 를 사용하기 때문에 해당 함수를 이해해야 한다. 좀 더 쉬운 이해를 위해서 아래와 같은 이벤트를 설정했다고 가정하자.

```javascript
$('#jq').click(function(){
	console.log('jQuery is fun');
});
```

## jQuery.bind()

먼저 이 함수는 엘리먼트들의 이벤트에 핸들러를 부착(attach)시키는 메서드라는 것을 기억해두고 소스코드를 보도록 하자. 하지만 바로 볼 수는 없고 `init()` 을 먼저 봐야 하는데 이는 `find()` 의 정의가 `init()` 의 호출로 시작하기 때문이다. 먼저 해당 함수를 보면 아래와 같다.

```javascript
init: function(){
  ...
  jQuery.each( jQuery.macros.each, function(i,n){
    jQuery.fn[ i ] = function() {
      return this.each( n, arguments );
    };
  });
  ...
},
each: function( obj, fn, args ) {
  if ( obj.length == undefined )
    for ( var i in obj )
      fn.apply( obj[i], args || [i, obj[i]] );
  else
    for ( var i = 0; i < obj.length; i++ )
      fn.apply( obj[i], args || [i, obj[i]] );
  return obj;
}
```

`init()` 을 보면 위와 같은데 또 `each()` 라는 것이 나온다. 이는 첫번째 인자로 넘겨받은 객체에 대해 두번째 인자의 함수를 각각 실행하는 함수인데 유사배열객체이냐 아니냐에 따라 순회방식이 다르다. 어쨌든 해당함수를 활용하여 `jQuery.macros.each` 객체에 대해 `jQuery.fn` 객체의 프로퍼티에  함수를 할당한다. 이를 위해선 역시 `jQuery.macros.each` 를 보아야 한다.

```javascript
jQuery.macros = {
	...
	each: {
    ...
		bind: function( type, fn ) {
			if ( fn.constructor == String )
				fn = new Function("e", ( !fn.indexOf(".") ? "$(this)" : "return " ) + fn);
			jQuery.event.add( this, type, fn );
		},
    ...
	}
};
```

`jQuery.macros` 객체 안에 `each` 라는 프로퍼티로 내부객체가 존재하며 그 내부 객체 안에서 `bind` 라는 프로퍼티로 함수객체가 존재한다. 즉 위 코드를 종합해서 해석해보면, `jQuery.macros.each` 객체를 돌면서 각각의 프로퍼티와 그에 해당하는 값으로 `jQuery.fn` 객체, 결국 프로토타입에 메서드를 설정하는 것이라고 할 수 있다.

```javascript
jQuery.fn['bind'] = function() {
  return this.each(function( type, fn ) {
			if ( fn.constructor == String )
				fn = new Function("e", ( !fn.indexOf(".") ? "$(this)" : "return " ) + fn);
			jQuery.event.add( this, type, fn );
		}, arguments);
};
```

실제로는 위와 같은 코드가 실행되며 여기서 중요한 것은 `this` 가 누구에게 바인딩되느냐이며 그에 따라 `each()` 가 작동하는 방식이 달라진다. `each()` 는 `jQuery` 객체에 정의된 것이 있고 `jQuery.fn` 에 정의된 것이 있기 때문에 누가 호출하느냐에 따라 불리는 함수가 다르다. 따라서 `bind()` 를 호출하는 대상을 잘 봐야 한다.

## $('jq').bind() 호출

원래로 돌아와서 `click` 함수를 정의하는 방식을 보면 다음과 같다.

```javascript
// Handle event binding
jQuery.fn['click'] = function(f){
  return f ? this.bind('click', f) : this.trigger('click');
};
```

`f` 를 넘겨받았기 때문에 `bind()` 가 호출되는데 여기서 `bind()` 를 호출하는 대상이 `jQuery` 객체 인스턴스이므로 `each()` 를 호출할 수 없다. 여기서 헷갈릴 수 있는데 `jQuery` 객체 자체에 `each()` 가 있는 것이지 객체 인스턴스에 있는 것이 아니다. 따라서 프로토타입 체이닝을 통해 `each()` 메서드가 호출되며 이는 다음과 같이 동작한다.

```javascript
each: function( fn, args ) {
  return jQuery.each( this, fn, args );
}
```

즉 내부의 동작은 결국 `jQuery.each()` 를 호출하는 것이며 여기서 `fn` 은 `bind` 함수, `args` 에는 이벤트 핸들러의 참조값이다. `this` 는 당연히 `jQuery` 객체 인스턴스이며 해당 객체가 가진 값이 id에 해당하는 DOM 객체 하나이므로 그것을 `this` 로 바인딩하여 `fn` 인 `bind()` 를 호출한다.

```javascript
// bind()
function( type, fn ) {
  if ( fn.constructor == String )
    fn = new Function("e", ( !fn.indexOf(".") ? "$(this)" : "return " ) + fn);
  jQuery.event.add( this, type, fn );
}
```

여기서 `type` 은 id에 해당하는 DOM 객체이며 `fn` 은 이벤트 핸들러이다. 이벤트 핸들러는 함수이기 때문에 if 문을 넘어가고 새로 나오는 메서드를 봐야 한다. 길어졌으니 다음 포스팅에서 이어보도록 하자.

## 출처

* [인사이드 자바스크립트](http://www.yes24.com/Product/Goods/11781589?scode=032&OzSrank=1)