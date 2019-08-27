---
title: "[GIT] 용량이 큰 파일을 삭제했는데도 push가 실패할 때"
date: 2019-08-27T14:31:45+09:00
categories: ["git"]
tags: ["git", "push"]
draft: true
---

제목 그대로, 용량이 큰 파일을 올리다가 실패해서 삭제하고 다시 push했는데 실패하는 경우가 종종 있었다. 자주 이런 현상이 발생해서 해결법을 정리하고자 한다.

## 이런 현상이 발생하는 이유

> Git stores the full history of your project, so even if you 'delete' a file from your project, the Git repo still has a copy of the file in it's history, and if you try to push to another repository (like one hosted at GitHub) then Git *requires* the remote repo has the same history that your local repo does (ie the same big files in it's history).

Git은 프로젝트의 히스토리를 저장하기 때문에 로컬에서 큰 용량의 파일을 삭제했다고 해도 히스토리에 해당 파일의 복사본을 가지고 있다. 즉, 원격 저장소와 로컬 저장소의 히스토리가 동일해야 받아들여지기 때문에 히스토리를 비워주어야 한다.



## 해결방법

* 로컬에서 해당 파일을 삭제한다.
* 삭제한 결과를 커밋한다.
* `git reset --soft HEAD~N` 으로 N개의 커밋이 있다면 해당 커밋을 취소한다.
* `git commit -sm 'message"` 로 다시 커밋한다. (이 작업을 [Squash](https://gist.github.com/patik/b8a9dc5cd356f9f6f980) 라고 한다.)
* Squash 된 커밋을 다시 push 한다.



## 참조

* [Can't push to GitHub because of large file which I already deleted](https://stackoverflow.com/questions/19573031/cant-push-to-github-because-of-large-file-which-i-already-deleted)