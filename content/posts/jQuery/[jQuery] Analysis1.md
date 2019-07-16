---
title: "[jQuery] jQuery 1.0 소스코드 분석 (1)"
date: 2019-07-16T17:03:11+09:00
categories: ["jQuery"]
tags: ["jQuery", "1.0"]
cover: ""
draft: false
---

[소스 코드](http://code.jquery.com/jquery-1.0.js)

## jQuery 객체와 변수 $의 매핑

스크립트가 로드 되면서 jQuery 객체가 선언되고 해당 객체는 변수 `$` 에 매핑된다.

```javascript
function jQuery(a,c) {
  ...
}

// Map the jQuery namespace to the '$' one
var $ = jQuery;
```

## jQuery.prototype 객체 변경

```javascript
jQuery.fn = jQuery.prototype = {
	jquery: "$Rev: 509 $",
	size: ~
	get: ~
  ...
	add: ~
	is: ~
	domManip: ~ 
	pushStack: ~
};
```

`jQuery.prototype` 객체를 변경함과 동시에 `jQuery.fn` 이 참조하게 한다. 따라서 생성자 함수 `jQuery` 로 생성한 객체 인스턴스의 프로토타입 객체는 `jQuery.fn` 이 된다.

## jQuery.extend()

```javascript
jQuery.extend = jQuery.fn.extend = function(obj,prop) {
	if ( !prop ) { prop = obj; obj = this; }
	for ( var i in prop ) obj[i] = prop[i];
	return obj;
};
```

`jQuery` 객체와 `jQuery.fn` 객체 (`jQuery.prototype` 객체와 동일하므로 이렇게 부르기로 한다.) 에 메서드를 추가하며 이는 `obj` 객체에 `prop` 객체의 모든 프로퍼티를 추가하는 함수이다. 만약 `prop` 이 없을 경우 `this` 에 `obj` 의 프로퍼티를 추가하는 방식으로 구현된다. 이처럼 인자를 1개만 넘길 경우에 해당 메서드를 호출한 대상에게 모든 프로퍼티가 추가되므로 다음 코드는 각각 `jQuery` 객체와 `jQuery.fn` 객체의 기능을 확장하는 코드이다.

```javascript
jQuery.extend();
jQuery.fn.extend();
```

## jQuery의 기본 구조

위에서 설명한 내용들을 쉽게 그림으로 나타내면 다음과 같다.

<img src="/images/jQuery/analysis/structure.png" width="600px" class="center">

`jQuery` 객체는 역시 함수객체이므로 당연히 자기자신의 메서드를 가질 수 있으며 이는 인스턴스에 특화되어 있는 것이 아닌 범용적으로 사용하는 코어 메서드로 구성된다.

## jQuery 함수가 id 선택자를 다루는 방식

이제 `jQuery` 함수 객체의 전체적인 동작방식을 이해하기 위해 `$('#jq')` 와 같은 코드를 사용했다고 하자. 이 때 어떤 식으로 동작하는지 코드를 하나하나 살펴봐야 한다.

```javascript
function jQuery(a,c) {
	if ( a && a.constructor == Function && jQuery.fn.ready )
		return jQuery(document).ready(a);
  ...
}
```

매개변수로 `a` 에는 `'#jq'` 가 넘어오며 `undefined` 가 아니고 생성자 함수가 `Function` 이 아니라 `String` 이기 때문에 넘어간다. 여기서 `constructor` 는 생성자 함수를 의미하는데 이는 프로토타입 객체에 정의되어 있으므로 여기서 프로토타입 체인을 활용한다.

```javascript
a = a || jQuery.context || document;
```

`a` 는 `'#jq'` 이므로 그대로 넘어간다.

```javascript
if ( a.jquery )
		return $( jQuery.merge( a, [] ) );
```

만약 `a` 가 프로퍼티로 `jquery` 를 가질 경우 해당 메소드를 실행하라는 것인데 이는 넘어오는 인자가 `jQuery` 객체임을 확인하는 것이다. 그 이유는 `jQuery.fn` 객체에 `jquery` 프로퍼티가 정의되어 있기 때문이다.

```javascript
if ( c && c.jquery )
		return $( c ).find(a);
```

위 코드 또한 방금전과 동일하게 `c` 가 `jQuery` 객체인지 확인한다. 아니므로 넘어간다.

```javascript
if ( window == this )
		return new jQuery(a,c);
```

생성자 함수가 아닌 일반 함수로 호출되었는지 확인하는 것으로 일반 함수로 호출되면 `this` 가 `window` 전역객체에 바인딩되기 때문에 위와 같이 검사하는 것이다. 생성자 함수로 호출되지 않았을 경우 빈 객체, 즉 새롭게 생성될 `jQuery` 객체를 만들어내기 위해 생성자 함수로 재호출한다. 이를 통해 `jQuery.fn` 객체의 프로퍼티나 메서드에도 접근할 수 있게 된다.

```javascript
var m = /^[^<]*(<.+>)[^>]*$/.exec(a);
if ( m ) a = jQuery.clean( [ m[1] ] );
```

자바스크립트의 리터럴 정규표현식으로 `^` 는 문자열의 시작을 의미하고 `$` 는 문자열의 끝을 의미한다. 또한 리터럴 정규표현식의 시작과 끝은 `/` 이다. 따라서 리터럴 정규식 내에서 `/` 를 쓰기 위해선 이스케이프 시퀀스인 `\` 를 이용해 `\/` 로 써야 한다. 어쨌든 `exec()` 메서드에 인자값을 넘겨서 인자가 HTML 태그형태인지 확인하는 것이다. 아니므로 넘어간다. (참고로 `exec()` 은 매칭되는 것을 찾았을 경우 배열로 반환한다.)

```javascript
this.get( a.constructor == Array || a.length && !a.nodeType && a[0] != undefined && a[0].nodeType ?
		// Assume that it is an array of DOM Elements
		jQuery.merge( a, [] ) :

		// Find the matching elements and save them for later
		jQuery.find( a, c ) );
```

조건식이 거짓이므로 `jQuery.find(a,c)` 가 호출된다. 따라서 `find()` 가 어떻게 동작하는지 알아야 한다.

## jQuery.find()

find 함수는 선택자를 인자로 받아 해당 선택자와 일치하는 DOM 객체들을 찾는 함수이다.

```javascript
function( t, context ) {
  // Make sure that the context is a DOM Element
  if ( context && context.nodeType == undefined )
    context = null;

  // Set the correct context (if none is provided)
  context = context || jQuery.context || document;
  ...
}
```

먼저 `context` 변수에 대한 초기화를 진행한다. 여기서 인자로 들어오는 `'#jq'` 이므로 `document` 가 된다.

```javascript
if ( t.constructor != String ) return [t];
	
if ( !t.indexOf("//") ) {
  context = context.documentElement;
  t = t.substr(2,t.length);
} else if ( !t.indexOf("/") ) {
  context = context.documentElement;
  t = t.substr(1,t.length);
  // FIX Assume the root element is right :(
  if ( t.indexOf("/") >= 1 )
    t = t.substr(t.indexOf("/"),t.length);
}
```

생성자 함수가 문자열이 아니라면 배열로 리턴하는데 아니니까 패스한다. 여기서 `!t.indexOf("//")` 와 `!t.indexOf("/")` 는 `t` 가 `"//"` 나 `"/"` 로 시작하는지를 판단하며 이를 정제하는 과정이다.

```javascript
var ret = [context];
var done = [];
var last = null;

while ( t.length > 0 && last != t ) {
  var r = [];
  last = t;

  t = jQuery.trim(t).replace( /^\/\//i, "" );

  var foundToken = false;

  for ( var i = 0; i < jQuery.token.length; i += 2 ) {
    var re = new RegExp("^(" + jQuery.token[i] + ")");
    var m = re.exec(t);

    if ( m ) {
      r = ret = jQuery.map( ret, jQuery.token[i+1] );
      t = jQuery.trim( t.replace( re, "" ) );
      foundToken = true;
    }
  }
  ... // while문 안 끝남
```

3개의 변수를 정의하고 `t` 의 길이가 0보다 길면 계속한다. 들어가서 `trim()` 으로 양쪽 공백을 제거한 뒤에 정규식으로 내부의 모든 `//` 문자열을 빈 문자열로 교체한다. 여기서 `jQuery.token` 배열에 대해 2개씩 점프하면서 반복문을 돌리는데 어떻게 생겼는지 보도록 하자.

```javascript
token: [
  "\\.\\.|/\\.\\.", "a.parentNode",
  ">|/", "jQuery.sibling(a.firstChild)",
  "\\+", "jQuery.sibling(a).next",
  "~", function(a){
    var r = [];
    var s = jQuery.sibling(a);
    if ( s.n > 0 )
      for ( var i = s.n; i < s.length; i++ )
        r.push( s[i] );
    return r;
  }
]
```

배열이고 위의 반복문은 정규표현식에 쓸 문자열들만 본다는 것을 알 수 있다. 그렇게 각각의 요소를 가져와서 정규표현식 생성자 함수인 `RegExp()` 에 넣는데 이게 좀 복잡하다. `token` 배열의 값은 문자열인데 문자열 내에 `\\` 는 정규식에서 `\` 로 변환되는데 정규식에서 `\` 는 이스케이프 시퀀스이고 이걸 문자열의 시작인 기호 `^` 와 동시에 괄호로 묶었으니 `..` 이나 `/..` 로 시작되는 문자열을 검사하는 것이라고 볼 수 있다. 따라서 이런 정규식 관련 문자열들을 돌면서 매칭되는 배열을 `m` 에 받는다.

여기선 `m` 이 `null` 이므로 그 다음을 실행한다.

```javascript
  if ( !foundToken ) {
    if ( !t.indexOf(",") || !t.indexOf("|") ) {
      if ( ret[0] == context ) ret.shift();
      done = jQuery.merge( done, ret );
      r = ret = [context];
      t = " " + t.substr(1,t.length);
    } else {
      var re2 = /^([#.]?)([a-z0-9\\*_-]*)/i;
      var m = re2.exec(t);

      if ( m[1] == "#" ) {
        // Ummm, should make this work in all XML docs
        var oid = document.getElementById(m[2]);
        r = ret = oid ? [oid] : [];
        t = t.replace( re2, "" );
      } else {
        if ( !m[2] || m[1] == "." ) m[2] = "*";

        for ( var i = 0; i < ret.length; i++ )
          r = jQuery.merge( r,
                           m[2] == "*" ?
                           jQuery.getAll(ret[i]) :
                           ret[i].getElementsByTagName(m[2])
                          );
      }
    }
  }
```

`t` 가 `,` 나 `|` 로 시작하지 않기 때문에 `else` 로 넘어가서 또 다른 정규식을 본다. 해당 정규식은 문자열의 시작이 `#` 이나 `.` 로 시작될 경우 해당 문자를 캡쳐한다는 것이다. 그 이후는 문자나 숫자 또는 특수문자들을 보고 그에 맞는 패턴을 찾아서 `m` 에 넣는다. `m` 에는 인덱스 0,1,2에 각각 `'#jq'` , `'#'`, `'jq'` 가 들어가게 되고 이는 매칭되기 때문에 해당 if 문을 실행한다.

`oid` 에 `'jq'` 의 DOM 객체를 찾아 넣고 이걸 배열 형태로 `r` 과 `ret` 에 넣는다. 그 다음 `t` 에 만든 정규식에 해당하는 문자열을 지운 결과로 초기화시킨다.

```javascript
    if ( t ) {
      var val = jQuery.filter(t,r);
      ret = r = val.r;
      t = jQuery.trim(val.t);
    }
  }
	// while 문 종료
	if ( ret && ret[0] == context ) ret.shift();
	done = jQuery.merge( done, ret );
	
	return done;
}
```

`t` 가 빈 문자열이므로 while 문을 빠져나오고 `ret[0]` 이 `document` 가 아닌 `element` 객체이므로  넘어가고 마지막에 `done` 에 중복없이 합쳐진다음(`merge()` 의 역할) 리턴된다.

이제 `find()` 의 호출이 끝났으니 이를 `this.get()` 의 인자로 넘겨야 한다. 이는 다음 포스팅에서 알아보자.

## 출처

* [인사이드 자바스크립트](http://www.yes24.com/Product/Goods/11781589?scode=032&OzSrank=1)