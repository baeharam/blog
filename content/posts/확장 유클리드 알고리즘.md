---
title: "[알고리즘] 확장 유클리드 알고리즘"
date: 2019-07-08T17:35:22+09:00
categories: ["알고리즘"]
tags: ["알고리즘", "유클리드 호제법", "베주 항등식"]
draft: false
---

# 유클리드 호제법(Euclidean algorithm)

## 정의

유클리드 호제법(= 유클리드 알고리즘)은 두 정수 사이의 최대공약수를 보다 효과적으로 구하는 방법으로 두 정수 $a,b$ 가 존재할 때 다음 식을 만족하는 방법론을 일컫는 말이다.
$$
GCD(A,B) = GCD(B,r)
$$
이 때 $A\gt B$ 가 성립하며 $A\equiv r\ (mod\ B)$ 를 조건으로 한다.

## 증명

두 정수 $A,B(A \gt B)$ 의 최대공약수(GCD)를 $G$ 라고 하자. $G$ 는 공약수이므로 두 서로소 $a,b$ 에 대해 다음 식이 성립한다.
$$
A=aG, B=bG
$$
$A$ 를 $B$ 로 나눈 나머지를 $r$ , 몫을 $q$ 라고 하면 $A=qB+r\ (0\le r \lt \lvert B \rvert)$ 를 만족한다. 이 식과 위의 식을 이용해서 새로운 식을 전개해보면 다음과 같다.
$$
aG=bGq+r \\
r=G(a-qb)
$$
이 때 $B$ 와 $r$ 의 최대공약수가 $G$ 임을 보이면 증명이 끝나는데 이는 $b$ 와 $a-qb$ 가 서로소임을 증명하는 것과 같다. 귀류법을 사용하여 $b$ 와 $a-qb$ 가 서로소가 아니라고 가정해보자. 서로소가 아닐 경우 2이상의 최대공약수가 존재하며 그걸 $p$ 라고 하면 두 정수 $n,m$ 에 대하여 다음 식이 성립한다.
$$
b=np, a-qb=mp
$$
$a-qb=mp$ 는 다시 $b=np$ 를 이용해 아래와 같이 전개할 수 있다.
$$
\begin{align}
a&=qb+mp \\\\\
&=qnp+mp \\\\\
&=(qn+m)p
\end{align}
$$
위 식에 의해서 $a,b$ 는 공약수인 $p$ 를 가지게 되는데 가장 처음에 가정했던 $a,b$ 가 서로소라는 것에 모순이 되기 때문에 $b, a-qb$ 는 반드시 서로소여야 한다. 따라서 $GCD(B,r)=G$ 가 성립한다.

## 구현

```c++
int gcd(int a, int b)
{
  if(b==0) return a;
  return gcd(b,a%b);
}
```



# 베주 항등식(Bezout's Identity)

## 정의

확장 유클리드 호제법을 공부하기 전에 먼저 베주 항등식을 알아야 하는데 그 이유는 확장 유클리드 호제법이 베주 항등식의 명제를 가정으로 하여 해를 구하는 방법이기 때문이다. 3가지 참인 명제가 있으며 이는 아래와 같다.

$GCD(a,b)=d$ 라고 할 때,

- $ax+by=d$ 를 만족하는 정수 $x,y$ 가 존재한다.
- $d$ 는 정수 $x,y$ 에 대하여 $ax+by$ 로 표현할 수 있는 가장 작은 정수이다.
- $ax+by$ 로 표현될 수 있는 모든 정수는 $d$ 의 배수이다.

## 증명

둘 중 하나는 0이 아닌 정수 $a,b$ 에 대하여 집합 $S$ 를 다음과 같이 정의하자.
$$
S=\{ax+by\gt 0 \ | \ x,y \in \mathbb Z\}
$$
집합 $S$ 는 위 정의에 따라 자연수의 부분집합이고 $S$ 가 공집합이 아니라면 <u>자연수의 정렬성</u>인 **"자연수의 부분집합이 공집합이 아닐 경우 가장 작은 값을 원소로 가진다."** 에 따라서 가장 작은 값을 원소로 가진다. 따라서 $S$ 가 공집합이 아니라는 것을 증명하면 $S$ 가 $ax+by$ 로 나타낼 수 있는 가장 작은 자연수를 원소로 가진다는 사실을 증명할 수 있다.
$$
\lvert a \rvert=
\begin{cases}
a\times 1+ b\times 0 \in S & \text{if}\ a \gt 0\\\\\
a\times -1+ b\times 0 \in S & \text{if}\ a \lt 0\\\\\
0,\ b\neq 0 & \text{if}\ a = 0\\
\end{cases}
$$
위 3가지 경우에 대해 모두 $\lvert a \rvert$ 가 $S$ 에 속하기 때문에 $\lvert a\rvert$ 나 $\lvert b\rvert$ 중 적어도 1개가 $S$ 에 속한다는 것을 알 수 있다. 따라서 위에서 언급한 자연수의 정렬성에 따라 $S$ 는 $ax+by$ 로 나타낼 수 있는 가장 작은 자연수를 원소로 가지며 그것을 $d$ 라고 하자.

임의의 정수 $k,l$ 에 대해 $d=ak+bl$ 로 나타낼 수 있으며 나눗셈 정리에 따라서 $S$ 의 임의의 원소를 $x$ 라고 했을 때 $x=dq+r\ (0\le r\lt d)$ 로 쓸 수 있다. 이 때 $x$ 를 $d$ 의 배수가 아니라고 가정하면 $r\neq 0$ 이므로 자연수라고 할 수 있고 $x$ 가 $S$ 에 속하기 때문에 임의의 정수 $u,v$ 에 대해 $x=au+bv$ 로 나타낼 수 있다. 이걸 종합해서 $r$ 에 대해 풀어쓰면 다음과 같다.
$$
\begin{align}
r&=x-dq&\\\\\\
&=(au+bv)-dq\\\\\
&=(au+bv)-(ak+bl)q\\\\\
&=au-akq+bv-blq\\\\\
&=a(u-kq)+b(v-lq) \in S
\end{align}
$$
이 때 $r$ 은 $d$ 로 나눈 나머지이기 때문에 $d$ 보다 작은데, $d$ 의 정의가 $S$ 에서 가장 작은 자연수이므로 모순이다. 따라서 처음에 가정했던 "$x$ 가 $d$ 의 배수가 아니다" 라는 가정은 거짓이 되므로 $x$ 는 $d$ 의 배수이다. 여기서 $x$ 는 $S$ 의 임의의 원소이기 때문에 $S$ 의 모든 원소는 $d$ 의 배수이다. $\lvert a\rvert,\lvert b\rvert$ 중 적어도 하나는 $S$ 의 원소이기 때문에 $d$ 는 $a,b$ 의 공약수가 된다.

$GCD(a,b)=G,\ a=AG,\ b=BG$  일 때, $d=ak+bl=AGk+BGl=G(Ak+Bl)$ 이 성립하므로 $d$ 는 $G$ 의 배수이다. 위에서 $d$ 가 $a,b$ 의 공약수였기 때문에 $d$ 는 $G$ 의 약수이면서 배수이게 된다. 따라서 $d=G=GCD(a,b)$ 가 성립하며 증명이 끝난다.



# 확장 유클리드 호제법(Extended Euclidean Algorithm)

## 정의

베주 항등식에 따라서 $GCD(a,b)=d$ 라고 할 때 $ax+by=d$ 를 만족하는 $x,y$ 가 존재하며 이는 유클리드 호제법의 과정을 역으로 따라가면 찾을 수 있다. 따라서, 유클리드 호제법의 과정을 따라가봐야 한다. 두 정수 $a,b$ 에 대해 나눗셈 정리와 유클리드 호제법을 반복하여 다음과 같이 나열할 수 있다.


$$
\begin{align}\\\\\
a=bq\_0+r\_1\\\\\
b=r\_1q\_1+r\_2\\\\\
r\_1=r\_2q\_2+r\_3\\\\\
...\\\\\
r\_{i-1}=r\_iq_i+r\_{i+1}\\\\\
\end{align}
$$


여기서 $r\_{i+1}=r\_{i-1}-r\_iq\_i$ 를 얻을 수 있고 $r\_{i+1}=0$ 일 때 알고리즘이 종료된다는 것을 알 수 있다. 여기서 $d$ 는 $r\_i$ 이므로 $ax+by$ 꼴로 나타내기 위해서 $r\_0=a, r\_1=b$ 라고 하면 $r\_0=a\times 1+b\times 0$ 이 되고 $r\_1=a\times 0+b\times 1$ 이 된다. 이는 이후의 $r\_i$ 도 같은 꼴로 나타내어진다는 것을 알 수 있다. 이 때 임의의 $r\_i$ 에 대해 $a$ 의 계수를 $s\_i$, $b$ 의 계수를 $t\_i$ 라고 하면 아래와 같이 표현할 수 있다.
$$
r_i = s_ia+t_ib
$$
이를 $r\_{i+1}=r\_{i-1}-r\_iq\_i$ 에 대입하면 다음 점화식을 얻어낼 수 있다.
$$
\begin{align}
s\_{i+1}a+t\_{i+1}b&=(s\_{i-1}a+t\_{i-1}b)-(s\_ia+t\_ib)q\_i\\\\\
&=s\_{i-1}a-s_iaq\_i+t\_{i-1}b-t\_ibq\_i\\\\\
&=(s\_{i-1}-s\_iq\_i)a+(t\_{i-1}-t\_iq\_i)b
\end{align}
$$
이제까지의 식을 총정리하면 다음과 같다.
$$
r\_0=a,\ r\_1=b\\\\\
s\_0=1,\ s\_1=0\\\\\
t\_0=0,\ t\_1=1\\\\\
r\_{i+1}=r\_{i-1}-r\_iq_i\\\\\
s\_{i+1}=s\_{i-1}-s\_iq_i\\\\\
t\_{i+1}=t\_{i-1}-t\_iq_i
$$

## 구현

```c++
void EEA(int a, int b)
{
  int r0=a, r1=b;
  int s0=1, s1=0;
  int t0=0, t1=1;
  int temp=0,q=0;
  
  while(r1){
    q=r0/r1;
    temp=r0;
    r0=r1;
    r1=temp-r1*q;
    temp=s0;
    s0=s1;
    s1=temp-s1*q;
    temp=t0;
    t0=t1;
    t1=temp-t1*q;
  }
}
```

## 참고

- [확장 유클리드 알고리즘](https://blog.naver.com/PostView.nhn?blogId=kks227&logNo=221414840544&parentCategoryNo=&categoryNo=299&viewDate=&isShowPopularPosts=true&from=search)
- [유클리드 호제법의 확장]([https://ko.wikipedia.org/wiki/%EC%9C%A0%ED%81%B4%EB%A6%AC%EB%93%9C\_%ED%98%B8%EC%A0%9C%EB%B2%95#%ED%98%B8%EC%A0%9C%EB%B2%95%EC%9D%98\_%ED%99%95%EC%9E%A5](https://ko.wikipedia.org/wiki/유클리드\_호제법#호제법의\_확장))
- [확장 유클리드 알고리즘](https://chin0.github.io/algorithm/math/egcd/)
- [Extended Euclidean Algorithm](https://en.wikipedia.org/wiki/Extended\_Euclidean\_algorithm)
- [베주 항등식]([https://namu.wiki/w/%EB%B2%A0%EC%A3%BC%20%ED%95%AD%EB%93%B1%EC%8B%9D#fn-1](https://namu.wiki/w/베주 항등식#fn-1))