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
- https://benjaminjochims.de/ — 섹션 슬라이드업 효과, 마우스 반응 blob 배경

## 피그마 스케치
- fileKey: bFVY1Mks4IkZDQhzAt9dt5 (파일명: porfolio-beta)
- node 3:3 — About 섹션 스케치 (프로필, 스킬, 툴바, 경력)
- node 5:24 — 컴포넌트 탐색 (탭, 로고, 버튼 상태)

## GitHub 저장소 & 배포
- https://github.com/Beomjeong/portfolio2026
- `main` 브랜치, 작업 후 커밋/푸시로 세이브포인트 관리
- **GitHub Pages 라이브**: https://beomjeong.github.io/portfolio2026/
- `memory/` 폴더도 저장소에 포함

## 구현 현황 (2026-06-02 기준)

### 완료된 것
- `/index.html` — 전체 페이지 구조
  - Header (스크롤 시 blur 전환, nav 호버 언더라인)
  - **Nav 로고**: `assets/logo_beomjeong.svg` img 태그로 교체 (height: 26px)
  - Hero (리뉴얼 완료 — 아래 상세)
  - Works (탭 필터 All/Web/Video/3D/Printing + 8개 플레이스홀더 카드 + 호버 오버레이)
    - 오버레이 툴 표시: 텍스트 pill → **SVG 아이콘** (CSS tool icon map)
  - About (프로필 사진 자리, 자기소개 텍스트, 스킬 목록, 툴바, 경력 4개)
  - Contact (이메일, 인스타 + 고정 배경 효과)
- `/css/style.css` — 전체 스타일 (반응형 포함)
- `/js/main.js` — 애니메이션 및 인터랙션

### Hero 섹션 상세 (리뉴얼)
- 구조: "안녕하세요! 저는" (greeting) + "[역할]" (role)
- role 텍스트 3초마다 스크램블 전환: 콘텐츠 디자이너 → 콘텐츠 기획자 → 바이브 코더
- `<canvas>` 그리드 배경: 마우스 근처 격자 볼록 변형 효과
- 마우스 따라오는 blob 2개: 민트그린(`#00E5B8`) + 파랑(`#4499ff`)
- `position: fixed` — 스크롤 시 완전 고정

### 스크롤 레이어링 구조
- hero: `position: fixed; z-index: 1`
- works: `margin-top: 100dvh; z-index: 2; border-radius: 20px 20px 0 0`
- about: `z-index: 3; border-radius: 20px 20px 0 0`
- contact: `position: relative; z-index: 4; background: transparent`
- **contactBg**: `position: fixed; inset: 0; z-index: 0` — contact의 배경(canvas+blob)을 별도 fixed 레이어로 분리

### Contact 배경 고정 효과
- `#contactBg` div (fixed, z-index: 0): canvas + blob 포함, 뷰포트 전체 고정
- contact 섹션 자체는 투명 배경으로 그 위를 스크롤
- about(z-index:3)이 화면에 있을 때 contactBg를 가림 → about 스크롤 아웃 시 배경 드러남
- ScrollTrigger: contact 진입 시 hero `autoAlpha: 0` 즉시 설정, 복귀 시 0.3s 페이드인

### JS 구조
- `initBgEffect(section, opts)` — canvas 그리드 + blob 애니메이션 재사용 함수
  - `opts.useWindowMouse: true` 옵션: fixed canvas용 (clientX/Y 직접 사용)
  - hero, contactBg 양쪽에 독립적으로 적용
- `scrambleTo(target)` — 텍스트 스크램블 함수
- GSAP ScrollTrigger — 섹션 리빌, 툴바 애니메이션, Works 카드 reveal, hero 숨김

### Works 툴 아이콘 CSS 맵
```css
.tool-ps      → assets/ic_photoshop.svg
.tool-ai      → assets/ic_illustrator.svg
.tool-lr      → assets/ic_lightroom.svg
.tool-ae      → assets/ic_after_effects.svg
.tool-pr      → assets/ic_premiere_pro.svg
.tool-blender → assets/ic_blender.svg
.tool-figma   → assets/ic_figma.svg
```
HTML: `<li class="tool-ps" title="Photoshop"></li>` 형태로 사용

### 에셋 현황 (assets/)
- `logo_beomjeong.svg` (255×40) — nav 로고 (로고마크 + 텍스트 통합)
- `bi_beomjeong.svg` — 브랜드 아이덴티티 마크
- `favicon.png` — 파비콘
- `Thumbnail_800x400.jpg`, `Thumbnail_1200x630.jpg` — OG 이미지
- `ic_photoshop/illustrator/lightroom/after_effects/premiere_pro/blender/figma.svg` — 툴 아이콘 7종

### OG 메타태그
- og:url, og:image, twitter:image 모두 절대경로로 설정 완료
- 기준 URL: `https://beomjeong.github.io/portfolio2026/`

### 남은 것
- 프로필 사진 교체 (`.photo-placeholder` → `<img>`)
- 실제 작업물 이미지로 플레이스홀더 교체
- 작업물 상세 페이지 (`/works/*.html`) 제작 — 8개 (web×3, video×2, 3d×1, print×2)

## 파일 구조
```
portfolio2026/
├── index.html
├── css/style.css
├── js/main.js
├── assets/         ← SVG 아이콘, 로고, 썸네일 등
├── works/          ← 상세 페이지 예정
└── memory/         ← 프로젝트 메모 (git 포함)
```

**Why:** 스타트업 중심 지원이므로 트렌디하고 인터랙티브한 느낌이 중요
**How to apply:** 과도한 장식보다 모션 퀄리티에 집중, 작업물이 주인공이 되도록 레이아웃 구성
