---
title: "[CSS] line-height"
date: 2019-07-17T16:37:28+09:00
categories: ["CSS"]
tags: ["CSS","line-height"]
draft: false
---

## 원래의 목적

> The **line-height** [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) property sets the height of a line box. It's commonly used to set the distance between lines of text. On block-level elements, it specifies the minimum height of line boxes within the element. On non-[replaced](https://developer.mozilla.org/en-US/docs/Web/CSS/Replaced_element) inline elements, it specifies the height that is used to calculate line box height.
>
> line-height 는 line box의 높이를 설정하는 CSS의 속성이다. 이는 보통 텍스트의 줄 간격 사이를 정하기 위해 사용된다. 블록-레벨 요소에선,  그 안의 요소들의 line box 높이 중 최솟값으로 지정된다. 대체불가능한 인라인 요소들에선 line box의 높이 계산에 사용되는 높이로 지정된다.

MDN의 설명을 보면 `line-box` 라는 개념이 나오며 이를 통해서 `line-height` 가 결정된다고 한다. 따라서 `line-box` 가 무엇인지 알아야 하는데 이를 알기 위해선 폰트의 높이가 어떻게 결정되는지를 알아야 한다.

<img src="/images/css/line height/line-box.png" class="center">

<center>[그림 출처](http://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align?utm_source=CSS-Weekly&utm_campaign=Issue-253&utm_medium=web)</center>

위 그림에서 `content-area` 영역과 `virtual-area(line-height)` 영역으로 나뉘어 결국 `line-height` 가 `line-box` 의 높이가 되는 것을 알 수 있다. 이 때 `content-area` 에 바깥쪽 공간이 위/아래로 있는데 이는 `half-leading` 영역이라 불리는 것으로 텍스트를 가독성 있게 읽을 수 있도록 만들어놓은 공간이다. 또한 여기서 주목할 점은 `content-area` 영역도 위/아래 공간이 있는 것이다. 이는 폰트를 만든 디자이너가 설정한 것이기 때문에 각 폰트의 종류마다 달라진다. 즉, 원래의 목적은 이름 그대로 폰트의 높이를 통해서 줄과 줄 사이의 간격을 결정하는 속성인데 다양한 변수들이 있기 때문에 어떤 방식으로 작동하는지 알아야 대처할 수 있다.

## 특성

`line-height` 는 기본값이 `normal` 이며 이는 폰트의 크기에 `half-leading` 영역을 더한 공간이다. 이렇게 폰트의 높이가 정해지는 바람에 CSS를 짤 때 당황한 적이 있다. 이걸 해결하기 위해선 해당 요소의 폰트 사이즈의 배수로 높이를 설정하는 방법이 있다.

```css
h1 { line-height: 1; font-size: 16px; }
```

위와 같이 설정하면 만약에 기존 폰트 사이즈가 20px이라고 했을 때 높이가 16px이 된다. 단위가 없는 값으로 많이 사용되고는 있지만 `em` 단위로 사용할 때도 있는데 이 때 주의할 상황은 다음과 같은 상황이다.

```html
<p>
 <h1> line-height </h1>
</p>
```

```css
p { line-height: 1em; font-size: 18px; }
h1 { font-size: 16px; }
```

위 상황이 되면 `em` 은 현재 요소의 폰트 사이즈의 배수 기준이기 때문에 `1em=18px` 이 되고 이 속성이 자식 요소인 `h1` 에게 물려지게 되어 원하는 16px과는 다른 18px이 `line-height` 로 들어가게 된다.

## 주의할 점

참고한 아티클에 따르면 `line-height: 1;` 을 지정하는 습관이 좋지 않다고 지정하는데 이는 폰트 사이즈의 크기 보다 `content-area` 영역의 크기가 더 클 수 있기 때문이다. 아래 그림을 통해 확인할 수 있다.

<img src="/images/css/line height/reason.png" class="center">

<center>[그림 출처](http://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align?utm_source=CSS-Weekly&utm_campaign=Issue-253&utm_medium=web)</center>

## 참조

* [빔캠프-라인하이트](https://www.youtube.com/watch?v=SDa7f8os2WA)
* [Deep dive CSS: font metrics, line-height and vertical-align](http://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align?utm_source=CSS-Weekly&utm_campaign=Issue-253&utm_medium=web)
* [위 링크 번역본](https://wit.nts-corp.com/2017/09/25/4903)

