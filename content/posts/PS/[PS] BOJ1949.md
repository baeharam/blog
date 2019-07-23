---
title: "[PS] BOJ1949: 우수마을"
date: 2019-07-23T11:15:24+09:00
categories: ["PS"]
tags: ["BOJ1949","우수마을"]
draft: false
---

[백준 1949번](https://www.acmicpc.net/problem/1949)

사회망 서비스 문제와 비슷한 트리 dp 문제인데 어렵게 느껴져서 그런지 점화식을 찾지 못했다. 질문란의 힌트를 보고 점화식을 이해한 후 재귀+메모이제이션으로 해결했다.

```
dp1[i] = i번 노드를 루트로 하는 서브트리에서 i번 노드를 선택했을 때의 최댓값
dp2[i] = i번 노드를 루트로 하는 서브트리에서 i번 노드를 선택하지 않았을 때의 최댓값
```

이렇게 dp 배열 2개를 만든 뒤 DFS로 탐색하면서 메모이제이션 돌리면 된다. 이 문제의 핵심은 3번째 조건인 "우수마을로 선정되지 않은 마을은 반드시 우수마을과 인접해야 한다." 를 고려하지 않아도 답을 낼 수 있다는 것이다. 그 이유는 인접한 마을 중에 우수마을이 아예 없는 경우에는 2번 조건인 "우수마을과 우수마을은 인접해서는 안된다."를 만족하면서 해당 마을을 우수마을로 선정하는 것이 항상 최댓값이기 때문이다. 어찌보면 항상 최댓값을 도출해야 하기 때문에 당연한 것이라고 할 수 있다.

```c++
#include <cstdio>
#include <cstring>
#include <vector>
#include <algorithm>
using namespace std;

int n,v1,v2;
const int SIZE = 10001;
int cost[SIZE], dp1[SIZE], dp2[SIZE], visited[SIZE];
vector<int> tree[SIZE];

int solve(int root, bool choice)
{
    visited[root] = 1;
    int &ret = choice ? dp1[root] : dp2[root];
    if(ret != -1) return ret;
    ret = choice ? cost[root] : 0;
    for(int i=0; i<tree[root].size(); i++){
        int next = tree[root][i];
        if(!visited[next]){
            if(choice) ret += solve(next,false);
            else ret += max(solve(next,false),solve(next,true));
        }
    }
    visited[root] = 0;
    return ret;
}

int main(void)
{
    scanf("%d",&n);
    for(int i=1; i<=n; i++) scanf("%d",&cost[i]);
    for(int i=0; i<n-1; i++){
        scanf("%d%d",&v1,&v2);
        tree[v1].push_back(v2);
        tree[v2].push_back(v1);
    }
    memset(dp1,-1,sizeof(dp1));
    memset(dp2,-1,sizeof(dp2));
    printf("%d\n",max(solve(1,true),solve(1,false)));
    return 0;
}
```

