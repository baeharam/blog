---
title: "[GIT] Submodule"
date: 2019-09-22T17:02:32+09:00
categories: ["git"]
tags: ["git", "submodule"]
draft: true
---

## Submodule의 필요성

프론트엔드쪽 개인 프로젝트를 진행하면서 호스팅을 깃헙 페이지를 통해서 하기로 결정했다. 그런데 따로 계정을 파지 않아도 원래 블로그를 호스팅 하고 있는 현재 웹 사이트인 https://baeharam.github.io 의 저장소에서 submodule을 통해 호스팅을 따로 시킬 수 있다는 것을 알게 되었다. 처음에는 단순 호스팅만 하면 되겠거니 하고 submodule에 대해서 체계적으로 공부하지 않았으나 어느 정도 프로젝트를 완성시킨 후에 배포를 하려고 했을 때 경로 관련 오류가 발생하였다. 따라서 이 포스팅에선 submodule이 무엇이며 어떻게 사용하는지에 대해 정리할 것이다.



## Submodule 추가하기

https://baeharam.github.io 저장소의 로컬 디렉토리로 이동한 후에 추가할 submodule의 저장소 URL로 다음 작업을 해주면 추가할 수 있다. (레드벨벳 팬 사이트 관련 저장소를 작업하고 있다고 가정하고 해당 저장소 이름은 Redvelvet-Fansite이다.)

```bash
git submodule add https://github.com/Redvelvet-Fansite
```

이렇게 submodule을 추가하게 되면 자동으로 `.gitmodules` 파일이 생성되고 아래 내용과 같다.

```bash
[submodule "Redvelvet-Fansite"]
    path = Redvelvet-Fansite
    url = https://github.com/chaconinc/Redvelvet-Fansite
```

이제 아래와 같은 디렉토리 구조가 된 것이다.

```
baeharam.github.io
|
+-- Redvelvet-Fansite
|
+-- .gitmodules
|
+-- ...
```

