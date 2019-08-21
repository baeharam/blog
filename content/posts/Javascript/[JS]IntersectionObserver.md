---
title: "[Javascript] Intersection Observer API"
date: 2019-08-21T14:21:16+09:00
categories: [Javascript]
tags: [Javascript, IntersectionObserver]
draft: false
---

## 스크롤에 따른 효과를 어떻게 줄 수 있을까?

웹 개발을 하다보면 사용자가 스크롤 하는 상태에 따라서 현재 보여지는 뷰포트에 가시적으로 어떤 엘리먼트가 나타나는지 확인하고 싶을 때가 있다. [ScrollReveal](https://scrollrevealjs.org/) 사이트와 같은 효과를 주고 싶을 때 특히 유용한데 보통 서서히 나타나는 fade-in 효과나 서서히 사라지는 fade-out 효과를 주고는 한다.

<img src="/images/javascript/observer/scrollreveal.gif" width="400px" class="center">

그렇다면 이런 효과를 주기 위해선 꼭 라이브러리를 사용해야 할까? 물론 똑똑한 사람들이 잘 만들어 놓은 라이브러리는 상당히 많다. 하지만 역시나 라이브러리를 쓰게 되면 용량이 많아지고 사용하지 않는 기능들도 가지고 있어야 하는 단점이 있다. 따라서 단지 스크롤에 따른 엘리먼트를 캡쳐하고 싶다면 직접 구현해보는 것이 도움될 것이다. 이 포스팅에선 엘리먼트를 캡쳐하는 2가지 방법으로 직접 계산하는 방법과 API를 활용하는 방법에 대해 알아볼 것이다.



## 직접 계산해보자!!

직접 계산한다는 것은 현재 창의 스크롤 위치, 엘리먼트의 스크롤 위치, 크기 등을 계산한 후, 비교함을 통해 엘리먼트가 현재의 스크롤 상태에서 캡쳐될 수 있는지를 체크하는 방법을 말한다. 이는 바로 직전에 포스팅 한 [브라우저의 창에 대한 이해](https://baeharam.github.io/posts/javascript/js-window/) 를 통해서 배운 여러가지 프로퍼티와 함수를 통해서 계산해낼 수 있다. [Stackoverflow](https://stackoverflow.com/a/7557433/11789111) 에 권장되는 방법을 참고하면 아래와 같다.

```javascript
function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
```

포스팅 하면서 직접 구현하던 와중에 이 방법이 훨씬 간결하다고 생각해서 대체하였다. 위 방법은 `getBoundingClientRect()` 로 엘리먼트의 뷰포트에 대한 좌푯값들을 얻어낸 뒤 창의 높이와 너비를 비교하는 방식이다. 해당 함수를 통해 엘리먼트 전체가 보여지는 뷰포트 안에 들어있는지 아닌지 확인할 수 있다. 이렇게 구현한 함수를 통해서 fade-in/fade-out 효과를 줄 수 있는데 이것이 바로 첫번째 방법이다. 하지만 첫번째 방법이 최적의 솔루션이라면 두번째 방법이 나올리가 없지 않은가? 무엇이 문제인지 알아보도록 하자.



## 리플로우(Reflow) 문제

구글의 정의에 따르면 다음과 같다.

> **Reflow** is the name of the web browser process for re-calculating the positions and geometries of elements in the document, for the purpose of re-rendering part or all of the document.
>
> **리플로우** 는 문서내의 요소들에 대해서 위치와 좌표를 다시 계산하는 웹 브라우저의 프로세스이다. 이는 문서의 일부분 혹은 전부를 다시 렌더링 할 때 사용된다.

즉, 엘리먼트가 문서내에서 어디에 위치하는지에 대한 정보를 계산해서 다시 렌더링을 하는 현상을 뜻한다. 이는 해당되는 엘리먼트 뿐만 아니라 그 엘리먼트가 포함하는 자식들에 대해서도 리플로우를 일으킨다. 렌더링을 하는 작업이기 때문에 비용이 굉장히 비싼데 그 비용에 비해서 쉽게 일어날 수 있는 현상이다. 리플로우를 발생시키는 경우들은 [What forces layout/reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) 에서 확인할 수 있다. 그렇다면 왜 첫번째 방법과 리플로우는 연관성이 있을까? 그 이유는 첫번째 방법에서 엘리먼트의 좌푯값을 얻어내기 위해 사용되는 함수인 `getBoundingClientRect()` 가 리플로우를 발생시키기 때문이다. 따라서 퍼포먼스 이슈가 있을 수밖에 없는 것이다. 일단 아래 코드펜을 통해서 잘 동작하는지 확인해보자.

<p class="codepen" data-height="429" data-theme-id="0" data-default-tab="js,result" data-user="BaeHaram" data-slug-hash="LYPbRzW" style="height: 429px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Reflow">
  <span>See the Pen <a href="https://codepen.io/BaeHaram/pen/LYPbRzW/">
  Reflow</a> by 배하람 (<a href="https://codepen.io/BaeHaram">@BaeHaram</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

스크롤에 따라서 효과가 잘 주어지는 것을 볼 수 있다. 그렇다면 어떻게 성능 이슈가 나타날까?

<img src="/images/javascript/observer/reflow1.png" width="400px" class="center">

보라색 부분을 주목해서 보자. 보라색 부분이 렌더링 시키는 부분으로 리플로우를 계속해서 일으키고 있다는 것을 확인할 수 있다. 따라서 스크롤에 의존하는 부분이 많다면 성능문제로 고통을 받을 수밖에 없다. 이제 이 문제를 개선하기 위해서 포스팅의 핵심주제인 Intersection Observer API를 활용하자.



## Intersection Observer API

이 API는 메인 쓰레드에 영향을 주지 않으며 비동기적으로 동작하기 때문에 퍼포먼스 측면에서 `getBoundingClientRect()` 를 사용하는 것보다 효율적이다. 보통 아래와 같은 경우에서 사용한다고 한다.

- 페이지가 스크롤됨에 따라서 이미지나 컨텐츠를 로드하고 싶은 **"레이지 로딩(Lazy Loading)"** 기법
- 사용자가 스크롤하는 것에 따라서 컨텐츠가 로드되고 렌더링 되는 **"무한 스크롤(Infinite Scroll)"** 기법
- 광고 수익을 계산하기 위해서 광고의 가시성 여부의 판단
- 사용자가 보고 있는 것에 따라서 작업이나 애니메이션을 수행할지의 여부에 대한 결정

여기서 실제로 사용해본 것은 레이지 로딩으로 상당히 유용했는데, 사용하기가 아주 간단하다는 측면이 마음에 들었다. 여기선 위의 퍼포먼스를 개선해서 얼마나 좋아지는지 눈으로 확인해보도록 하자. 

<p class="codepen" data-height="429" data-theme-id="0" data-default-tab="js,result" data-user="BaeHaram" data-slug-hash="gOYLwEB" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Reflow-fix">
  <span>See the Pen <a href="https://codepen.io/BaeHaram/pen/gOYLwEB/">
  Reflow-fix</a> by 배하람 (<a href="https://codepen.io/BaeHaram">@BaeHaram</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

<img src="/images/javascript/observer/reflow2.png" width="400px" class="center">

잠시만… 확인해봤는데 여전히 리플로우가 발생해서 뭐가 문제인지 확인해보니 `opacity` 도 [webkit 엔진에서 리플로우를 발생시킨다](https://gist.github.com/paulirish/5d52fb081b3570c81e3a#gistcomment-2014608) 고 한다. 크롬이 webkit 기반이라서 발생하는 듯하다. 그래도 리플로우가 줄어드는 것은 확실했다. 이렇게 API를 활용하여 성능개선을 해보았는데 이제 어떤 방식으로 사용할 수 있을지, 어떤 옵션들이 있는지 확인해 보도록 하자.



## Intersection Observer의 사용법

* `root` : 루트는 말 그대로 API가 교차(intersect)되는 여부를 확인할 때의 기준이 되는 요소로 기본적으로는 뷰포트로 설정되는데 여기서 굉장히 **주의할 점이 사용자에게 보여지는 뷰포트인 visual viewport가 아니라 레이아웃 기준에 해당하는 layout viewport 라는 것이다.** 이 부분을 캐치하지 못해 많은 난항을 겪을 수 있기 때문에 반드시 기억해두어야 한다.
* `rootMargin` : 루트에 마진을 주는 옵션으로 일반 마진과 동일하게 적용되며 네거티브 마진 또한 가능하다. 이를 사용하는 이유는 루트를 지정하고 루트의 범위를 좁히거나 넓히기 위함이다. 매번 루트를 바꿀 수도 없고 루트의 단위로 컨트롤 되지 않는 부분이 있기 때문에 굉장히 유용하다.
* `threshold` : 엘리먼트의 가시성 여부를 판단하기 위한 값으로 0에서 1까지 허용되는데 숫자가 클수록 엘리먼트가 많이 보여진다는 것을 뜻한다.

다음 예제를 통해서 위의 3가지 옵션을 확인해보자.

<p class="codepen" data-height="429" data-theme-id="0" data-default-tab="js,result" data-user="BaeHaram" data-slug-hash="QWLGGNb" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="IntersectionObserver-root">
  <span>See the Pen <a href="https://codepen.io/BaeHaram/pen/QWLGGNb/">
  IntersectionObserver-root</a> by 배하람 (<a href="https://codepen.io/BaeHaram">@BaeHaram</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

위와 같이 기본적인 방식으로 API를 사용할 수 있으며 각각의 `entry` 에 대해서 여러가지 유용한 메소드들을 활용할 수 있다.

* `unobserve` : 해당 엔트리에 대해 더 이상 observe 하지 않겠다는 의미로 한번만 효과를 주고 싶을 때 유용하다.
* `isIntersecting` : 현재 엘리먼트가 루트에 대해서 교차하고 있는지의 여부에 대해 판단해주는 불리안 값이다.
* `intersectionRatio` : 엘리먼트가 루트에 대해서 얼마나 교차하고 있는지에 대한 값을 0~1 사이의 값이다.

이외에도 `disconnect()`, `rootBounds` 등과 같은 메소드와 프로퍼티들이 있으니 필요할 때 공식 문서를 참고해서 사용하자.



## 마무리하며...

이렇게 IntersectionObserver API에 대해서 알아봤는데 2019년 8월 21일 현재로서 [Can I Use](https://caniuse.com/#search=intersectionobserver) 를 확인해보면 IE, Opera Mini 말고는 대부분 지원하는 추세이다. 따라서 IE를 지원하지 않아도 된다면 `getBoundingClientRect()` 보다는 API를 활용하는 것이 훨씬 좋을 듯 하다. 만약에 IE에도 사용하고 싶다면 [폴리필](https://github.com/w3c/IntersectionObserver/tree/master/polyfill#browser-support) 을 따로 받아서 사용할 수도 있다.



## 참조

* [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

* [Intersection Observer API의 사용법과 활용방법](http://blog.hyeyoonjung.com/2019/01/09/intersectionobserver-tutorial/)

* [IntersectionObserver를 이용한 이미지 동적 로딩 기능 개선](https://tech.lezhin.com/2017/07/13/intersectionobserver-overview)

  