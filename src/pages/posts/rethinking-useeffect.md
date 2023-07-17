---
title: useEffect 다시 생각하기
date: 2022-09-09
description: useEffect 의 메커니즘을 재정립해보자.
layout: ../../layouts/PostLayout.astro
---

## `useEffect` 되돌아보기

리액트에서 훅이 나온 시점부터 흔히들 말하는 "부수효과(Side Effect)" 를 구현하기 위해 `useEffect` 를 많이 사용해왔다. 클래스 컴포넌트에서 넘어오는 시점에 `componentDidMount` 와 같은 생명주기(Life Cycle) 함수를 대체하는 훅이 아니냐 했던 시점은 지났고 대부분의 사람들은 부수효과를 작동시키는데 사용하고 있는 추세이다. 훅이 나온 날짜는 2019년 2월 16일로 16.8 릴리즈에서 처음 등장했다. 오늘 날짜가 22년 9월 9일이니 3년 7개월정도가 지나서 오랜 기간 수많은 사람들이 훅을 사용해왔다.

많이 사용한 만큼 `useEffect` 의 크기가 커지고 개수가 많아짐에 따라서 웹 어플리케이션의 코드를 읽는게 점점 어려워졌고 의존성에 따라 동작해서 렌더링되는 횟수를 예측하기도 어려워졌다. 또한, 정말 이 훅에 적합한 상황에서만 사용하지 않는 경우도 꽤 발생했기 때문에 하나의 컴포넌트 안에서 필요없는 `useEffect` 의 사용들도 많아졌다. 따라서, 이 포스팅에선 `useEffect` 를 사용하는 이유에 대해 다시 살펴보고자 한다.

<br />

## 리액트의 렌더링과 부수효과

리액트에서 컴포넌트는 **순수함수(pure function)** 인데, 동일한 입력값들을 받았으면 반드시 동일한 JSX 를 반환해야 한다는 의미이다. 이는 새로운 리액트 문서에 정확히 명시되어 있다.

> **React assumes that every component you write is a pure function.** This means that React components you write must always return the same JSX given the same inputs

컴포넌트가 순수함수라면, 화면을 업데이트 하고 애니메이션을 수행하는 등의 부수효과들은 어디서 구현해야 할까? 이것 또한 공식 문서에 있는데 일반적으로 **"이벤트 핸들러" 안에서 부수효과를 실행한다.** 이벤트 핸들러는 렌더링 중에서 상태값을 변화시키지 않고 오직 "사용자 액션" 에 반응하여 특정 로직을 수행하기 때문에 컴포넌트 처럼 순수할 필요가 없이 여기서 부수효과를 실행할 수 있는 것이다.

하지만, 실무에선 모든 부수효과를 이벤트 핸들러가 담당할 수 있는 것이 아니다. 바로 이 때 사용하도록 만들어진 것이 `useEffect` 인데, 공식문서에선 다양한 방법들을 생각해보고 "마지막 수단" 으로 사용하라고 말한다.

> **However, this approach should be your last resort.**

따라서, `useEffect` 는 이벤트 핸들러로 해결할 수 없는 다른 부수효과를 실행하기 위한 것이며 최대한 다른 방법을 강구해보다가 마지막 방법으로 사용해야 한다는 것을 기억해야 한다.

<br />

## 동기화(Synchronization)

`useEffect` 를 사용할 때 가장 중요하게 생각해야 할 키워드가 "동기화"이다. 위 섹션에서 이벤트 핸들러로 해결할 수 없는 부수효과를 실행하기 위한 것이라고 말했는데, 이 때의 부수효과란 외부 시스템(External System)과 리액트를 동기화하는 로직이어야 하며 이벤트 핸들러와 같은 "이벤트" 가 아닌, "렌더링" 자체로 발생하는 부수효과여야 한다.

즉, 다시 정리하면 "외부 시스템" 과 동기화 하기 위한 "렌더링" 으로 발생하는 부수효과에 사용하는 것이 `useEffect` 라는 것이다. 아래의 공식 문서 설명을 보도록 하자.

> _Effects_ let you run some code after rendering so that you can synchronize your component with some system outside of React.

그렇다면 여기서 말하는 "외부 시스템" 이란 무엇일까? 관습적으로 우리가 짜는 코드들을 보면 알 수 있는데 DOM, 백엔드 API 서버, 애널리틱스(마케팅 도구들), 리액트로 만들지 않은 UI 위젯 라이브러리.. 등이 모두 해당된다. 좀 더 현상적으로 말하자면,

- DOM 이벤트 구독 ON/OFF
- DOM 애니메이션 구현
- `fetch` API 로 GET/POST 등의 요청
- 페이지 이동시마다, 로그 보내기

이런 것들이라고 할 수 있다. 가장 많이 사용한다고 생각하는 DOM 이벤트 구독 ON/OFF 의 경우 보통 이런식으로 사용한다.

```typescript
useEffect(() => {
  function handleScroll(e) {
    console.log(e.clientX, e.clientY);
  }
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

리액트를 계속 써온 사람이라면 당연하게도 이 코드가 "컴포넌트 마운트에 scroll 이벤트를 구독하고 언마운트시에 scroll 이벤트 구독을 해제한다" 라는 것을 알 수 있다. 여기선 "사용자 이벤트" 가 들어가있지 않으며 리액트 내부의 상태값과 연관되어 있지 않다. 따라서, 외부 시스템인 DOM 의 특정 이벤트와 "동기화" 를 하는데 첫 렌더링인 "마운트" 시에 발생시키기 때문에 공식 문서에서 말하는 `useEffect` 를 사용하는 조건과 일치함을 알 수 있다.

<br />

## `useEffect` 를 쓰지 않아도 되는 상황들

이제 언제 `useEffect` 를 써야 하는지 어느 정도 알았으니, 굳이 쓰지 않아도 되는 상황들을 알아보자. 이 상황들에 대해 인지하고 있어야 `useEffect` 를 사용할 때 리액트의 목적과 적합하게 사용할 수 있을 것이다.

### `state` 와 `props` 로 또 다른 `state` 업데이트

관습적으로, `state` 나 `props` 를 변형 또는 결합하여 또 다른 값을 만든 뒤 보여주고 싶은 경우에 해당 상태값을 선언하여 `useEffect` 로 업데이트 하는 로직을 많이 사용한다. 아래 공식문서의 예제는 좀 간단하긴 하지만 2개의 상태값을 결합하여 또 다른 값을 만드는 것이다.

```typescript
function Form() {
  const [firstName, setFirstName] = useState("Taylor");
  const [lastName, setLastName] = useState("Swift");

  // 🔴 좋지않음: 중복된 상태와 필요없는 이펙트
  const [fullName, setFullName] = useState("");
  useEffect(() => {
    setFullName(firstName + " " + lastName);
  }, [firstName, lastName]);
  // ...
}
```

만약 `setFirstName` 과 `setLastName` 을 다른 곳에서 사용하지 않고 오직 `firstName` 과 `lastName` 만을 결합하여 값을 만들어야 한다면, 굳이 상태값으로 만들 필요가 없다. 단순히 변수로 만드는게 가독성이 더 좋고 필요없는 코드가 줄어들게 된다. 애초에 결합 대상이 되는 `firstName` 과 `lastName` 이 업데이트 됐다는 것은 re-rendering 이 발생했다는 것이고 이에 따라 그 자체로 함수인 컴포넌트가 실행될 것이기 때문에 변수로 선언해도 충분하다. 만약 연산비용이 많이 비싼 경우라면 오히려 `useMemo` 를 이용하는 것이 합리적이다.

```typescript
function Form() {
  const [firstName, setFirstName] = useState("Taylor");
  const [lastName, setLastName] = useState("Swift");
  // ✅ 좋음: 렌더링 중에 계산됨
  const fullName = firstName + " " + lastName;
  // ...
}
```

### `props` 가 바뀔 때 상태값 초기화하기

`props` 로 내려오는 값에 의존하여 원하는 상태값들을 바꾸는 것은 자주 사용하는 패턴이다. 실무에서 이런 경우에 흔히들 `useEffect` 를 사용하고는 하는데 컴포넌트의 "모든" 상태값들을 초기화하는 경우라면 `key` 를 사용하는게 더 좋다.

```typescript
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState("");

  // 🔴 좋지않음: 이펙트 안에서 props 에 따라 초기화됨
  useEffect(() => {
    setComment("");
  }, [userId]);
  // ...
}
```

`key` 값이 바뀔 경우 이 값을 받는 컴포넌트의 상태값은 전부 날아가기 때문에 처음 선언했던 그 값부터 다시 시작한다.

```typescript
export default function ProfilePage({ userId }) {
  return <Profile userId={userId} key={userId} />;
}

function Profile({ userId }) {
  // ✅ 좋음: key 가 바뀜에 따라서 이 상태와 아래의 모든 상태들은 자동적으로 초기화된다.
  const [comment, setComment] = useState("");
  // ...
}
```

사실 이런 패턴이 나에겐 익숙치 않아서 좀 새로웠고 앞으로 사용할 수 있는 컨텍스트라면 한번 적용해보는 것이 좋을것 같다.

### 어플리케이션 초기화

리액트의 경우 `App.tsx` 파일에서 마운트 될 때 초기화 로직을 넣는 경우가 종종 있다.

```typescript
function App() {
  // 🔴 좋지않음: 단 1번만 실행할 로직들을 이펙트로 실행
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

하지만 굳이 이펙트가 필요없는 것이, 단 1번만 실행하면 되기에 컴포넌트 외부에서 실행해주면 간단하다.

```typescript
if (typeof window !== "undefined") {
  // 브라우저에서 실행하고 있는지 확인
  // ✅ 좋음: 앱이 로드될 때마다 1번만 실행
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

공식 문서에선 1번만 실행했는지 확인하는 플래그 변수인 `didInit` 같은 것과 이펙트를 같이 쓰는 것도 좋다고 하지만 그냥 외부에서 사용하는게 더 깔끔한 것 같다.

### 데이터 가져오기(Fetching)

React-query, SWR, Apollo 등과 같은 서버쪽 상태를 관리하는 도구가 나오기 전에는 이펙트 내부에서 `fetch` API 를 통해서 가져오는 로직이 일반적이었다.

```typescript
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 좋지않음: cleanup 로직 없이 데이터 가져오기
    fetchResults(query, page).then((json) => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

하지만 이펙트로 `fetch` API 를 사용할 경우 다양한 문제들이 발생한다.

1. 위 코드에서 말하는 `cleanup` 로직이 없을 경우 의존성 변수에 따라 여러번 서버요청을 하게 되고 이에 따라 어떤 값이 마지막에 올지 알 수 없는 race condition 문제가 발생한다.
2. 데이터가 오면 따로 캐시되는 부분이 없기 때문에 직접 캐싱 로직을 구현하던지 아니면 캐시를 사용하지 않아야 한다.
3. 모든 `fetch` 마다 이펙트를 실행해야 하는데 boilerplate 로직이 상당히 많아지기 때문에 커스텀 훅으로 감싸줘야 하며 커스텀 훅으로 만들어도 엣지 케이스가 생겨 점점 복잡해진다.

이러한 문제들은 리액트만의 문제는 아니고 UI 라이브러리의 일반적인 문제들이다. 따라서 리액트에선 앞서 언급했던 react-query, SWR 등과 같은 서버 데이터의 상태를 관리하는 라이브러리를 이용하는 걸 추천한다고 한다. 어쨌든 위 코드에 cleanup 을 한다고 하면 이미 실행했는지에 대한 플래그 변수를 선언하면 된다.

```typescript
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then((json) => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

이렇게 cleanup 을 하게 되면 마지막 요청을 제외한 모든 요청은 무시됨을 확정할 수 있다. 하지만 위에서 말한대로 1번 문제는 해결했을 수 있으나 2,3번 문제에 대한 해결책은 직접 추가해줘야 한다. 필연적으로 `useEffect` 를 써야 하는 상황이라면 커스텀 훅을 생각해보고 그게 아니라면 fetching 라이브러리 적용을 고려해보자.

<br />

## React 18과 `useEffect`

### Strict mode + development mode 에서의 동작

React 18 에선, strict mode 이면서 development mode 일 경우에, 마운트 → 언마운트 → 마운트 되는 현상이 있는데 리액트 측에서 의도한 바로 "이펙트" 를 제대로 사용하고 있는지 점검하기 위함이다. 즉, 여러번의 이펙트 실행해도 별다른 문제가 없는지 확인함으로서 해당 이펙트 로직이 리액트 철학에 맞는지를 확인하는 것이다. 2번 마운트하는 것을 통해서 이펙트 내부에서 cleanup 을 했는지, 내부 로직이 이펙트와 사용하기에 적합한지를 알 수 있으니 인지하고 있도록 하자.

### `useSyncExternalStore`

일반적으로 외부 스토어를 사용할 경우, 스토어 값의 변화에 따라서 컴포넌트 상태값을 업데이트 하고 싶은 경우가 있다. 예를 들어, 외부 스토어를 현재 온라인인 상태인지 여부를 판단하는 `navigator` 객체라고 했을 때 아래와 같이 이펙트를 사용해서 업데이트를 할 것이다.

```typescript
function useOnlineStatus() {
  // 이상적이지 않음: 이펙트를 사용해서 직접 구독하기
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener("online", updateState);
    window.addEventListener("offline", updateState);
    return () => {
      window.removeEventListener("online", updateState);
      window.removeEventListener("offline", updateState);
    };
  }, []);
  return isOnline;
}
```

온라인/오프라인 상태에 따라서 상태값을 업데이트 함으로 re-rendering 을 수행하는 이펙트이다. React 18 부터는 이런 목적을 위한 훅이 나왔고 그게 바로 `useSyncExternalStore` API 이다. 여기에 1번째 인자로 구독하는 함수를 넘기고 2번째 인자로 스토어의 값을 가져오는 함수를 넘겨주면 위 코드보다 간단히 구현할 수 있다. (서버 값을 가져오는 3번째 매개변수도 있지만 여기선 다루지 않는다.)

```typescript
function subscribe(callback) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function useOnlineStatus() {
  // ✅ 좋음: 내장 훅을 사용해서 외부 스토어 구독하기
  return useSyncExternalStore(
    subscribe, // 같은 함수를 넘기기만 하면 재구독 하지 않는다.
    () => navigator.onLine // 클라이언트 쪽에서 값을 가져오는 방식
  );
}
```

2번째 함수가 리턴하는 값이 바뀔 때마다 해당 훅을 통해서 re-rendering 되며 만약 1번째 함수의 레퍼런스 값이 바뀔 경우 cleanup 로직이 실행되고 재구독하게 된다. 실제 코드를 보면 아래와 같이 구현되어 있다.

```javascript
// React 의 useSyncExternalStoreShimClient.js
useEffect(() => {
  if (checkIfSnapshotChanged(inst)) {
    forceUpdate({ inst });
  }
  const handleStoreChange = () => {
    if (checkIfSnapshotChanged(inst)) {
      forceUpdate({ inst });
    }
  };
  return subscribe(handleStoreChange);
}, [subscribe]);
```

위 코드를 보면 `subscribe` 함수의 레퍼런스 값이 의존성으로 들어갔기 때문에 해당 값이 바뀔 때마다 cleanup 되고 재구독 한다는 것을 알 수 있다.

<br />

## 마무리하며

지금까지 `useEffect` 가 나온 목적과 적합한 사용방식 그리고 React 18 에서의 역할에 대해 살펴보았다. 이 글의 논지는 `useEffect` 를 사용하지 말라 라는 것이 아니며 정확한 사용 목적에 따라 적절하게 사용해야 한다는 것이다. 이제까지 관습적으로 `useEffect` 를 써왔다면 이 글을 계기로 이펙트를 사용해야 하는 이유에 대해 다시 한 번 생각해보는 습관을 기르면 좋을 것 같다. 저와 여러분의 코드가 좀 더 읽기 쉽고 유지보수가 편해지는 코드가 되길 바란다.

## 참고

- [React beta docs, Keeping Components Pure](https://beta.reactjs.org/learn/keeping-components-pure)
- [React beta docs, You Might Not Need an Effect](https://beta.reactjs.org/learn/you-might-not-need-an-effect)
- [React beta docs, Synchronizing with Effects](https://beta.reactjs.org/learn/synchronizing-with-effects#fetching-data)
- [Dan Abramov, A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)
- [React official docs, React v18.0](https://reactjs.org/blog/2022/03/29/react-v18.html)
- [React, useSyncExternalStoreShimClient 코드](https://github.com/facebook/react/blob/main/packages/use-sync-external-store/src/useSyncExternalStoreShimClient.js)
