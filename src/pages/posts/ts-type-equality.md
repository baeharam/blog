---
title: 타입스크립트에서 2개의 타입이 동일함을 알아내기
date: 2024-07-13
description: 타입의 동일성을 어떻게 판별할 수 있을까?
layout: ../../layouts/PostLayout.astro
---

## 조건부 타입

TS를 사용하다 보면 임의의 타입에 따라서 어떤 타입을 사용할지 결정하고 싶을 때가 있다. JS의 if-else 문과 동일한 맥락으로 특정 "조건" 에 맞거나 맞지 않은 경우에 타입을 분기치고 싶은 경우이다. 이럴 때 사용하는 것이 바로 조건부 타입(Conditional Type)이다.

이걸 구현하기 위해 사용하는 키워드가 `extends` 이며 `T extends A` 의 의미는 타입 `T` 를 타입 `A` 에 "할당(assign)" 할 수 있는지의 여부를 의미한다. 따라서, 다음과 같이 조건부 타입을 정의할 수 있다.

```ts
type ConditionalType<T> = T extends string ? number : null;

type A = ConditionalType<"Conditional Type">; // number
type B = ConditionalType<123>; // null;
```

## 제네릭 타입

제네릭은 TS에서 필수적인 기능중에 하나로 **다양한 타입을 유동적으로 처리**할 수 있게 "재사용성" 을 기준으로 설계된 기능이다. 임의의 어떤 타입 `T` 가 올 것을 생각하고 그 `T` 를 사용해 로직을 전개해나가는 방식이다. 자기 자신을 그대로 반환하는 `identity` 함수가 있다고 가정하자.

```ts
const identity = (arg: string): string => arg;
```

이런식으로 타입을 직접 "명시" 해서 사용할 수 있지만 인자에 `string` 이 아닌 다른 타입도 올 수 있기 때문에 이걸 미리 생각하고 제네릭을 활용할 수 있다.

```ts
const identity = <T>(arg: T): T => arg;
```

이러면 `T` 에 `string`, `number`, `undefined` 등 임의의 어떤 타입을 넣어도 그 타입을 반환하는 함수를 만들 수 있게 된다. 이게 바로 제네릭의 강력함이다. 또한 특정 타입으로 "제한" 할 수 있는데 예를 들어 사용자 정보를 정의한 타입 `User` 가 있다고 가정하고 해당 타입을 객체타입이라고 하자. 그리고 이 함수가 이 객체형태의 타입만 받았으면 하는게 개발자의 희망이라면, `extends` 와 조합해서 사용할 수 있다.

```ts
interface UserInfo {
  name: string;
  age: number;
}

const identity = <T extends UserInfo>(arg: T): T => arg;

identity({ name: "배하람", age: 30 });
identity("배하람"); // 형태가 맞지 않아 타입 에러 발생
```

## 타입의 동일성 - 일반적인 접근

지금까지 "조건부 타입" 과 "제네렉 타입" 에 대해서 설명했고 이 개념들은 모두 타입의 동일성을 어떻게 판단할 수 있을지를 정리하기 위한 초석이다. 타입의 동일성을 어떻게 판단할 수 있을까? 간단한 논리로 생각해보면 위에서 배운 `extends` 의 개념을 끌고 올 수 있다.

```ts
type IsEqual<T, U> = T extends U ? (U extends T ? true : false) : false;
```

임의의 타입 2개인 `T` 와 `U` 가 서로에게 할당할 수 있는 타입이라면 두 타입은 같다라고 말할 수 있지 않을까? 보통 처음 생각하게 되면 90%가 이렇게 판단할 수 밖에 없다. 뭔가 깔끔하게 이 논리로 풀릴 수 있을 것 같은 생각이 들지만 안타깝게도 그렇게 쉽게 풀리지 않으며 이 타입에는 반례가 존재한다.

```ts
type TypeEqualityTest = IsEqual<string, any>; // boolean (잘못됨)
```

`any` 와 `string` 은 완전히 다른 타입이기 때문에 `false` 가 나와야 하지만 뜬금포로 `boolean` 이 나온다. 무엇이 문제일까? 여기선 조건부 타입의 분배적 기능을 알아야 한다. `T extends U` 형태에서 `T` 가 유니온 타입이라면 **분배법칙이 적용된다.** 예를 들어,

```ts
type ToArray<T> = T extends any ? T[] : never;
type Result = ToArray<string | number>;  // string[] | number[] 
```

이런 식으로 결과값도 유니온 타입으로 수렴하게 된다. 이게 바로 `any` 가 피연산자 타입으로 들어갔을 때 문제가 되는 포인트인데 `any` 는 어떤 타입도 될 수 있기 때문에 당연하게도 유니온 타입 또한 될 수 있다.

```ts
type TypeEqualityTest = IsEqual<string, string | number>;
```

위 타입은 내부에서 `string | number` 타입에 분배법칙이 적용되면서 `string extends string` 과 `string extends number` 가 공존하게 된다. 두가지 경우는 각각 `true` 와 `false` 이기 때문에 결과타입을 모두 포괄하는 `boolean` 타입으로 귀결된다.

## 타입의 동일성 - 좀 더 생각하기

위에서 접근한 해결방식은 가장 기본적으로 조건부 타입을 활용하여 타입의 동일성을 검증하는 방식이었다.
그리고 바로 반례가 등장했기 때문에 이 타입으로 임의의 타입 2개에 대한 동일성을 검증하는 것을 불가능하다.
그러면 어떻게 해야할까? 좀 더 멀리서 바라보자. 우리는 타입의 동일성 검증을 위해서 피타입 2개를 그대로 활용했다.
하지만, 피타입을 그대로 사용하지 않고 **제네릭 타입과 결합하여 활용**할 수 있다. 먼저 답부터 보자.

```ts
type IsEqual<T, U>
  = (<G>() => G extends T ? 1 : 2) extends
    (<G>() => G extends U ? 1 : 2) 
    ? true : false;
```

이 타입을 처음보면 "엥??" 이라는 생각이 들 수도 있다. 나도 이 해결법에 대해서 처음 보고 해설을 봤는데도 잘 이해가 안됐기 때문에 되게 생소했다.
하지만 차근차근, 하나씩 뜯어보면 왜 이런방식을 사용해야 하는지 알 수 있다.

여기서 우리가 타입의 동일성을 검증하고자 하는 피타입 2개는 `T` 타입과 `U` 타입이다. 아직 어떤 타입인지 모르는 제네릭 타입이며 해당 피타입들을 활용해서 동일성 검증을 할 것이다. 그러기 위해선 제 3의 제네릭 타입 `G` 가 필요하다. 타입 `G` 또한 피타입이며 각 `T` 와 `U` 를 상속하는지에 대한 확인을 하기위한 타입이다.

즉, 핵심적인 아이디어는 타입 `T` 와 타입 `U` 에 대한 동일성을 직접 체크하는 것이 아니라, 제네릭 타입 `G` 를 사용하여 간접적으로 체크하는 것이다. 아직까지도 잘 이해되지 않을 수 있으니, 예시로 `string` 과 `number` 타입을 보자.

```ts
declare let x: <G>() => G extends string ? 1 : 2;
declare let y: <G>() => G extends number ? 1 : 2;
```

각 피타입을 분해해서 쓰면 위와 같이 쓸 수 있고 `T` 와 `U` 를 `string` 과 `nubmer` 로 치환할 수 있다.
이제 `G` 에 넣을 임의의 타입을 설정해보자. 만약, `x` 와 `y` 가 같다면 임의의 타입 `G` 에 대해 반드시 동일한 타입이 나와야 한다. 타입 `G` 를 `string` 이라고 해보자.

```ts
const p = x<string>(); // 1
const q = y<string>(); // 2
```

쉽게 예상할 수 있는 것처럼, `p` 의 타입은 `1`이고 `q` 의 타입은 `2`이기 때문에 `string` 과 `number` 타입은 다른 타입임을 알 수 있다.
이제 위에서 반례로 나왔던 `any` 와 `string` 을 비교해보자.

```ts
declare let x: <G>() => G extends any ? 1 : 2;
declare let y: <G>() => G extends string ? 1 : 2;

const p = x<any>(); // 1
const q = y<any>(); // 1 | 2
```

`G` 에 `any` 를 주었을 때, `p` 의 타입은 `1` 인데 `q` 의 타입은 `1 | 2` 인 유니온 타입이 나오기 때문에 `any` 와 `string` 은 다른 타입이다.
이제 위에서 단순하게 만들었던 동일성 검증 타입의 반례가 사라졌다! 조금 더 복잡한 타입을 줘보자.

```ts
declare let x: <G>() => G extends { a?: number } ? 1 : 2;
declare let y: <G>() => G extends {} ? 1 : 2;

const p = x<{ a: string }>(); // 2
const q = y<{ a: string }>(); // 1
```

타입 `{ a?: number }` 와 타입 `{}` 는 딱 봐도 다른 타입이지만 이전에 만든 단순 동일성검증 타입을 사용하면 `true` 라는 결과가 나온다.
하지만 위에선 보다시피 `p` 의 타입과 `q` 의 타입은 다르기 때문에 두 타입은 다른 타입이라는 결론이 나온다.

## 결론

지금까지 타입스크립트에서 어떻게 두 타입의 동일성을 엄격하게 검증할 수 있는지 살펴보았다.
이 문제는 [type-challenges](https://github.com/type-challenges/type-challenges) 저장소에서 타입스크립트 관련 문제를 풀다가 의문이 들어서 계속 찾아보았던 문제였다. 처음에 이해가 안되다가 계속해서 보고 또 보니 이해가 되었는데 임의의 타입 `G` 를 새로 생각한다는게 정말 신선한 접근이었다. 이런 접근방식은 추후에 다른 타입 문제에 놓여져 있을 때도 좀 활용해 볼 수 있을 것 같다.


## 참고

- [How does the `Equals` work in typescript?](https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript)