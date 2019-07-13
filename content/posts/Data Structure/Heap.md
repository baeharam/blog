---
title: "[자료구조] 힙(Heap)"
date: 2019-07-12T10:48:45+09:00
categories: ["자료구조"]
tags: ["자료구조", "힙"]
cover: "images/cover/data structure.png"
draft: false
---

## 힙의 정의

힙(Heap)이란 **완전 이진 트리**의 한 종류로 **최댓값이나 최솟값을 빠르게 찾아내기 위해 고안된 자료구조**이다. 힙의 각 노드는 키(Key)라는 값으로 구성되며 부모노드와 자식노드와의 관계는 다음이 성립한다.

* A가 부모노드, B가 자식노드일 경우 A의 키 값과 B의 키 값에는 대소관계가 주어진다.

힙은 자식 노드에 따라 여러가지 종류로 구분되지만 대부분 자식 노드 2개를 갖는 이진 힙(Binary Heap)을 사용하며 우선순위 큐(Priority Queue)의 구현체로 이용되거나 힙 정렬(Heap Sort)에 이용된다. 우선순위 큐가 사용되는 알고리즘으로는 최단경로를 찾는 다익스트라(Dijkstra) 알고리즘이 존재한다.

대소관계에는 크거나 작은 경우가 있으므로 **최대 힙(Max Heap)**과 **최소 힙(Min Heap)**으로 나뉘어진다. 최대 힙은 루트인 가장 위쪽 노드에 최대의 키 값이 있는 힙이며 최소 힙은 최소의 키 값이 있는 힙니다. 여기서 키 값은 단순한 숫자(Integer)가 될 수도 있지만 정의하는 것에 따라 복합적인 값이 될 수도 있다. 그러나 본문에서는 정확한 이해를 위해 숫자를 키 값으로 사용하기로 한다.

## 힙의 구현

힙을 구현할 때는 구조체를 이용해 노드를 선언하고 배열을 통해서 구현하는 것이 일반적이다. 배열의 최대 크기를 지정하고 왼쪽 자식노드는 `*2`로 오른쪽 자식노드는 `*2+1`을 통해 나타낸다. 따라서, 부모노드를 나타낼 때는 `/2`를 하게 된다. 이 점만 유의하면 힙의 구현은 직관적이라고 할 수 있다. 힙의 기능은 상당히 많지만 여기선 보다 명확한 이해를 위해 2가지 기능만 보기로 한다. 삽입과 삭제 연산이 존재하며 최대 힙을 통해 동작 원리를 살펴보기로  하자.

### 힙의 삽입

힙의 삽입은 삭제 연산보다 간단한데, 다음과 같은 단계로 이루어진다.

* 가장 마지막에 키 값과 함께 노드를 삽입한다.
* 부모노드와 비교해서 새로 삽입한 노드가 더 큰 값이라면 바꾸고 아니면 끝낸다.
* 2번 과정을 루트노드까지 계속한다.

예를들어, `10,2,5,12,17`을 살펴보자.

<img src="https://user-images.githubusercontent.com/35518072/52601848-a5ef9680-2ea3-11e9-9137-26319e2b98c8.png" width="500px" class="center">

먼저 2와 5가 삽입될 때는 최대 힙이기 때문에 아무 일도 일어나지 않는다.

<img src="https://user-images.githubusercontent.com/35518072/52601983-231b0b80-2ea4-11e9-97ec-f14ef32b712c.png" width="500px" class="center">

그러나 12가 들어가게 되면 위와 같이 12가 2와 10보다 크기 때문에 루트노드가 된다.

<img src="https://user-images.githubusercontent.com/35518072/52602150-e69bdf80-2ea4-11e9-9636-91bd3e113fdf.png" width="500px" class="center">

17도 12때와 마찬가지로 10보다 크고 12보다 크기 때문에 루트노드가 된다. 이제 위 과정을 코드로 살펴보자. 코드로 구현할 때는 보통 루트노드의 인덱스를 1로 잡는 것을 유념하자.

```c++
#include <cstdio>

#define MAX_SIZE 200

struct DSheap{
    int heap[MAX_SIZE];
    int size;

    DSheap(){ size = 0; }

    void push(int element)
    {
        // 힙이 다 찬 경우
        if(size==MAX_SIZE-1){
            puts("HEAP IS FULL!");
            return;
        }
        // 마지막에 삽입해야 하니 크기를 미리 증가시킨다.
        int index = ++size;

        // 1) 루트노드의 인덱스가 1이므로 1보다 커야 한다.
        // 2) 삽입하려는 값이 부모노드보다 큰지 확인한다.
        //    부모노드보다 크다면 바꾸는데 부모노드를 현재노드에 넣는다.
        //    이렇게 할 수 있는 이유는 element를 유지하기 때문.
        while(index>1 && (element>heap[index/2])){
            heap[index] = heap[index/2];
            index /= 2;
        }
        // 최대 힙을 만족시키는 위치를 찾은 경우이므로 그곳에 element를 삽입한다.
        heap[index] = element;
        printf("PUSH %d\n",element);
    }
};
```

`DSheap`이란 구조체를 선언한 후 `heap`이라는 배열로 힙을 구현하고 있다. 

### 힙의 삭제

힙의 삭제는 삽입보다는 살짝 복잡하긴 하지만 그래도 충분히 직관적이다. 삭제의 과정은 다음과 같이 이루어진다.

* 루트노드를 삭제한다.
* 마지막 노드를 루트노드로 바꾼다.
* 다시 최대 힙을 만족시키는 과정을 진행한다.
  * 왼쪽 자식노드와 오른쪽 자식노드 중 더 큰 값을 구한다.
  * 그 값과 현재 노드를 비교해서 연산을 수행한다.

예제로는 삽입을 이해할 때 썼던 마지막 구조를 이용하자.

<img src="https://user-images.githubusercontent.com/35518072/52602692-f3213780-2ea6-11e9-87af-d0535911c1e8.png" width="500px" class="center">

먼저 루트노드인 17을 삭제한 뒤, 마지막 노드인 10을 루트로 바꾼다. 이후 자식노드 중에 12가 큰 값이므로 10과 12를 비교하는데 12가 더 크기 때문에 바꾼다. 이 과정을 계속해야 하는데, 10이 2보다 크기 때문에 여기서 멈추게 되고 삭제연산이 종료된다.

```c++
int pop()
{
    // 힙이 비어있을 경우 삭제불가.
    if(size==0){
        puts("HEAP IS EMPTY!");
        return -1;
    }
    // 삭제하는 값은 루트노드
    int result = heap[1];
    // 마지막 노드를 가져오고 크기 줄인다.
    int last = heap[size--];
    
    // 루트노드부터 봐야 하므로
    // parent와 child값을 초기화
    int parent = 1, child = 2;

    // child가 마지막 노드일 때까지 계속.
    while(child <= size){
        // child가 마지막 노드가 아니고 오른쪽 자식 노드가 더 크다면
        // child 값 증가
        if(child<size && heap[child]<heap[child+1]){
            child++;
        }
        // 현재 노드가 child노드보다 크거나 같으면 중단
        if(last>=heap[child]){
            break;
        }
        // 현재 노드가 child노드보다 작다면 child를 위로 올리고
        // parent와 child를 갱신
        heap[parent] = heap[child];
        parent = child;
        child *= 2;
    }

    // 1) 중간에 중단하게 되면 child노드보다 크거나 같은 경우이므로 parent.
    // 2) 마지막 노드까지 조사한 경우여도 parent가 child가 되므로 parent.
    // 어떤 경우에도 parent에 넣어야 함.
    heap[parent] = last;
    printf("POP %d\n",result);
    return result;
}
```

## 힙의 시간복잡도

삽입과 삭제 모두 힙의 높이만큼, 즉 완전 이진 트리의 높이만큼 연산하는 경우가 최악의 경우(Worst Case)이므로, 힙의 높이가 무엇인지 안다면, 그 시간복잡도를 알 수 있다. 증명은 [여기](http://www.cs.gettysburg.edu/~ilinkin/courses/Fall-2012/cs216/notes/bintree.pdf)를 참조했다.

완전 이진 트리의 모든 노드가 존재한다고 했을 때 높이를 $h$라고 하고 첫번째 레벨을 0이라고 하자. 이 때, 노드의 개수를 $n$이라고 하면 다음이 성립한다.
$$
1+2^1+2^2+2^3...+2^h=n
$$
등비수열의 합공식에 따라서 $1+2^1+2^2+2^3+...2^h=2^{h+1}-1$임을 알 수 있고 $2^{h+1}-1=n$이라는 등식을 얻어낼 수 있다. 1을 우항으로 옮기고 양변에 로그를 취하고 계산해보면 아래와 같다.
$$
log_2{2^{h+1}}=log_2{(n+1)}\\
h+1=log_2{(n+1)}\\
h=log_2{(n+1)}-1
$$
결론적으로, 힙의 높이만큼 삽입과 삭제 연산이 일어나기 때문에 시간복잡도는 $O(h)=O(log_2{(n+1)}-1)=O(log_2{n})$이라고 할 수 있다.

## References

* [자료구조 힙(heap)이란](https://gmlwjd9405.github.io/2018/05/10/data-structure-heap.html)
* [위키백과 - 힙](https://ko.wikipedia.org/wiki/%ED%9E%99_(%EC%9E%90%EB%A3%8C_%EA%B5%AC%EC%A1%B0))
* [Wikipedia - Heap](https://en.wikipedia.org/wiki/Heap_(data_structure))