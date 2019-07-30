---
title: "[Javascript] 브라우저의 창에 대한 이해"
date: 2019-07-25T09:08:44+09:00
categories: ["Javascript"]
tags: ["Window","scrollHeight","clientHeight","offsetHeight"]
draft: false
---

스크롤 애니메이션을 구현하게 되면서 바닐라 JS로 특정 엘리먼트에 스크롤을 이동시키는 걸 공부했다. 그런데 공부를 할 때 창의 높이에 대한 정보가 무수히 많다는 걸 알게 되었고 이 참에 창의 높이와 너비에 어떤 속성들이 있는지 정리해보고자 한다.

<img src="/images/javascript/window/structure.png" class="center">

# Element 기준

## Client

* **Element.clientWidth / Element.clientHeight**

| Padding | ScrollBar | Border | Margin |
| ------- | --------- | ------ | ------ |
| O       | X         | X      | X      |

* **Element.clientLeft / Element.clientTop**
  * Element.clientLeft = border-left
  * Element.clientTop = border-top

## Offset

* **HTMLElement.offsetWidth / HTMLElement.offsetHeight**

| Padding | ScrollBar | Border | Margin |
| ------- | --------- | ------ | ------ |
| O       | O         | O      | X      |

* **HTMLElement.offsetLeft / HTMLElement.offsetTop**

`HTMLElement.offsetParent` 기준으로 왼쪽/위에서 얼마나 떨어져있는가에 대한 값으로 `position:relative` 인 엘리먼트를 찾아서 위로 올라가는데 없으면 시작점이 기준이 된다.

## Scroll

* **Element.scrollWidth / Element.scrollHeight**

스크롤바를 사용하지 않고도 모든 컨텐츠를 볼 수 있게 하는 너비와 높이, 그러나 경계선(border)은 포함하지 않는다.

* **Element.scrollLeft / Element.scrollTop**

얼마나 스크롤한지에 대한 좌푯값



# Window 기준

* **Window.innerWidth / Window.innerHeight**
  * 메뉴바, 툴바 제외한 안쪽 창 영역의 높이와 너비
* **Window.outerWidth / Window.outerHeight**
  * 메뉴바, 툴바 모두 포함한 전체 창 영역의 높이와 너비
* **Window.pageXOffset / Window.pageYOffset**
  * 전체 컨텐츠를 얼마나 스크롤했는가에 대한 값



이렇게 타겟 엘리먼트와 윈도우 기준으로 여러가지 창에 관한 속성을 알아봤는데 일단 이해해놓고 필요할 때 레퍼런스 참고해서 쓰면 될 것 같다. 중요한 점은 브라우저의 종류마다 정의하는 방식과 그 이름이 살짝씩 다를 수 있다는 점이다. IE같은 경우 `window` 대신 `document.documentElement` 나 `document.body` 를 사용하는 것이 그 예시이다.



## 참조

* https://webclub.tistory.com/104
* https://mommoo.tistory.com/85
* [https://github.com/jinyowo/JS-Calendar/wiki/**offsetHeight,-innerWidth-%EC%99%80-%EB%B9%84%EC%8A%B7%ED%95%9C-%EC%86%8D%EC%84%B1%EB%93%A4-%EC%A0%95%EB%A6%AC](https://github.com/jinyowo/JS-Calendar/wiki/**offsetHeight,-innerWidth-와-비슷한-속성들-정리)
* https://stackoverflow.com/a/45897388/11789111
* MDN