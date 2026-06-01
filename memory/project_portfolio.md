---
name: project-portfolio
description: 포트폴리오 사이트 기획 및 진행 현황 — 작업물 카테고리, 디자인 방향, 레퍼런스, 구현 현황
metadata:
  type: project
---

## 지원 우선순위
스타트업 > 인하우스 > 에이전시

## 작업물 카테고리
- **Web Promotion** — 이벤트페이지(PC/MO), 배너, 상세페이지(쇼핑몰/스마트스토어)
- **Video** — Short form(쇼츠/릴스), PR Video(YouTube)
- **3D** — Blender 3D 에셋 (소소하게 노출)
- **Printing** — 포스터, Stand Banner(X배너), Info Signage

## 작업물 카드 필수 항목
타이틀 / 사용툴 / 기여도

## 디자인 방향
- 라이트 모드
- 심플하면서 모션(스크롤, 클릭, 호버) 활용해 역동감 부여
- 액센트 컬러: 민트그린 `#00E5B8` (피그마 스케치에서 추출)

## 레퍼런스 사이트
- https://gamilyapp.com/ — 스크롤 이펙트
- https://unshift.jp/ — 마우스오버(호버) 이펙트
- https://katoshun.com/ — 이벤트페이지 방식의 작업물 노출
- https://u-d-l.jp/works/ — 깔끔한 분위기

## 피그마 스케치
- fileKey: bFVY1Mks4IkZDQhzAt9dt5 (파일명: porfolio-beta)
- node 3:3 — About 섹션 스케치 (프로필, 스킬, 툴바, 경력)
- node 5:24 — 컴포넌트 탐색 (탭, 로고, 버튼 상태)

## 구현 현황 (2026-05-30 기준)

### 완료된 것
- `/index.html` — 전체 페이지 구조 완성
  - Header (스크롤 시 blur 전환, nav 호버 언더라인)
  - Hero (대형 타입 + GSAP 등장 애니메이션)
  - Works (탭 필터 All/Web/Video/3D/Printing + 8개 플레이스홀더 카드 + 호버 오버레이)
  - About (프로필 사진 자리, 자기소개 텍스트, 스킬 목록, 툴바, 경력 4개)
  - Contact (이메일, 인스타)
- `/css/style.css` — 전체 스타일 (반응형 포함)
- `/js/main.js` — GSAP 애니메이션 (Hero 등장, 스크롤 리빌, 탭 필터, 툴바 애니메이션)

### 남은 것
- 프로필 사진 교체 (`.photo-placeholder` → `<img>`)
- 실제 작업물 이미지로 플레이스홀더 교체
- 작업물 상세 페이지 (`/works/*.html`) 제작
- GitHub Pages 배포 설정

## 파일 구조
```
portfolio2026/
├── index.html
├── css/style.css
├── js/main.js
└── works/          ← 상세 페이지 예정
```

**Why:** 스타트업 중심 지원이므로 트렌디하고 인터랙티브한 느낌이 중요
**How to apply:** 과도한 장식보다 모션 퀄리티에 집중, 작업물이 주인공이 되도록 레이아웃 구성
