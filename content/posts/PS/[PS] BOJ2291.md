---
title: "[PS] BOJ2291: Sequence"
date: 2019-07-23T09:33:54+09:00
categories: ["PS"]
tags: ["PS","BOJ2291","Sequence"]
draft: false
---

[백준 2291번](https://www.acmicpc.net/problem/2291)

$N$ 개의 숫자가 주어지고 해당 숫자를 합해서 $M$ 을 만드는 수열이 여러개 있을 때 오름차순으로 나열했을 때의 $K$ 번째 수열을 구하는 문제이다. 전형적인 dp 트래킹 문제인데 나에겐 너무 어려웠다. 애초에 점화식을 짜는게 어려워서 슬랙에 질문을 했고 다음과 같은 점화식을 통해서 해결하는 것이었다.

```
dp[first][len][sum] = 첫째 항이 first이고 길이가 len인 수열의 합을 sum으로 만들 수 있는 수열의 개수
```

풀이는 [여기](https://am003507.tistory.com/193) 를 공부해서 간신히 이해했다. 여기서 내가 이해하지 못했던 부분은 재귀함수의 기저사례인데, `first<=sum` 일 때 수열을 만들 수 있다고 정의했다. 계속 고민하다 보니 첫째 항이 현재 남은 합보다 작다면 나머지로 그 합을 채울 수 있을 테니까 기저사례가 맞다..!

이제 트래킹을 하면 되는데 트래킹을 할 땐 2가지 경우로 나눠야 한다. `first` 를 채택하는 경우와 그렇지 않은 경우로 나눠서 "오름차순" 이라는 특성에 맞게 재귀함수를 호출하면 된다. 또한 특이했던 점은 dp 값을 계산하는 타이밍이 트래킹을 할 때라는 것이었는데 트래킹을 하면서 `first` 를 채택했을 때의 수열의 개수를 보기 위해 그 때마다 dp 함수를 호출해주었다. 트래킹의 기저사례는 역시 dp의 기저사례와 동일하게 길이가 1이 되었을 때 `sum` 을 리턴해주면 된다.

```c++
#include <cstdio>
#include <cstring>
#include <vector>
using namespace std;

int dp[221][11][221];
vector<int> ans;

int solve(int first, int len, int sum)
{
    if(len == 1) return first<=sum;
    int &ret = dp[first][len][sum];
    if(ret != -1) return ret;
    ret = 0;
    for(int i=first; i<=sum; i++)
        ret += solve(i,len-1,sum-i);
    return ret;
}

void track(int first, int len, int sum, int order)
{
    if(len == 1){
        ans.push_back(sum);
        return;
    }
    int ret = solve(first,len-1,sum-first);
  	// 첫번째를 채택한 경우
    if(ret >= order){
        ans.push_back(first);
        track(first,len-1,sum-first,order);
    }
  	// 첫번째를 채택하지 않은 경우
  	else {
        track(first+1,len,sum,order-ret);
    }
}

int main(void)
{
    int n,m,k;
    scanf("%d%d%d",&n,&m,&k);
    memset(dp,-1,sizeof(dp));
    track(1,n,m,k);
    for(int i=0; i<ans.size(); i++) 
        printf("%d ",ans[i]);
    puts("");
    return 0;
}
```

