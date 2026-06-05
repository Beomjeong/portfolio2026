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

## 구현 현황 (2026-06-05 기준)

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

### 스크롤 레이어링 구조 (2026-06-04 업데이트)
- hero: `position: fixed; z-index: 1`
- works: `margin-top: 100dvh; position: relative; z-index: 2; border-radius: 20px 20px 0 0; box-shadow: 0 -8px 48px rgba(0,0,0,0.08)`
- about: `position: relative; z-index: 3; border-radius: 20px 20px 0 0; box-shadow 동일`
- contact: `position: relative; z-index: 4; background: #0d0d0d` (다크 배경)
- **contactBg 제거됨** — contact 자체에 배경+canvas 내장

> sticky stacking 시도했으나 섹션 높이가 100dvh 초과로 콘텐츠 잘림 문제 발생 → 각 섹션 relative로 복귀. 이후 레이아웃 재설계 시 재도전 예정.

### Contact 배경 (2026-06-04 변경)
- 다크 배경 `#0d0d0d` + `<canvas id="constellationCanvas">` 내장
- 별자리 파티클 효과: accent 컬러(`0,229,184`) 파티클 90개, 연결선 거리 140px
- 마우스 인터랙션: 마우스 주변 파티클과 연결선 추가 표시
- 파티클 반짝임(twinkle) 효과 포함
- 텍스트 색상 모두 흰색 계열(`#f0f0f0`, `rgba(240,240,240,x)`)로 변경

### Works 모달 시스템
- 카드 클릭 → 전체화면 모달 (97dvh, 아래서 슬라이드업 GSAP 애니메이션)
- 닫기: X 버튼 / ESC / 배경 클릭
- 모달 헤더 고정 (카테고리 · 제목 · 툴 · 기여도) + 본문 스크롤
- `MODAL_DATA` 객체로 카드 데이터 관리
- 카드 썸네일 비율: `4:3`

### Viewer Modal (2026-06-05 신규) — `type: 'viewer'`
전체화면 이미지 뷰어 팝업. Web Promotion 카드(web-01)에 적용.

**구조:**
- `#workViewer` — position:fixed fullscreen overlay (z-index: 300)
- `#viewerImgWrap` — 이미지 스크롤 영역 (flex:1, overflow-y:auto, 스크롤바 숨김)
- `#viewerImgStack` — PC/MO 이미지 스택 (CSS transition:opacity 0.2s)
- `#viewerBannerGrid` — 배너 2열 그리드 (position:absolute, is-active 클래스로 토글)
- `#viewerPanel` — 하단 정보 패널 (collapsed 클래스로 접기/펼치기)

**탭 버튼:** DM Sans 0.75rem 500 0.12em, 3가지 상태 (default/hover/active=accent색)

**애니메이션:**
- 오버레이 열기/닫기: GSAP opacity fade (0.35s/0.3s)
- 탭 전환: CSS transition opacity 0.2s + setTimeout 200ms (GSAP 사용 시 zoom artifact 발생하여 교체)

**스크롤 잠금:** iOS Safari 대응 position:fixed 패턴 — `openViewer`에서 scrollY 저장 후 body에 position:fixed/top:-scrollY 적용, `closeViewer` onComplete에서 복원

**현재 등록 카드:** `web-01` — PC 5장 / MO 5장 (max-width:720px) / Banner 6장 2열 그리드

**해결된 버그:**
- 모달 열고닫을 때 페이지 가로 흔들림 → `scrollbar-gutter: stable` on html
- 배너 그리드 스크롤바로 인한 패널 내부 흔들림 → `scrollbar-width: none`
- PC↔MO 전환 시 스케일 artifact → GSAP 대신 CSS transition + setTimeout
- Banner 뒤에 PC/MO 이미지 겹침 → `no-transition` 클래스로 즉시 숨김
- iOS 무한 스크롤 → position:fixed 스크롤 잠금 패턴

### JS 구조
- `initBgEffect(section, opts)` — canvas 그리드 + blob (hero에만 적용)
- `initConstellation()` — contact 별자리 파티클 (IIFE)
- `scrambleTo(target)` — 텍스트 스크램블 함수
- GSAP ScrollTrigger — 섹션 리빌, 툴바 애니메이션, Works 카드 reveal
- hero 숨기기 ScrollTrigger 제거됨 (z-index로 자연스럽게 가려짐)

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
- Works 섹션에 카드 추가 (web-01 외 다른 작업물 등록)
- 이후 카테고리별 모달 레이아웃 (Video, 3D, Print) 순차 작업
- 프로필 사진 교체 (`.photo-placeholder` → `<img>`)
- 실제 작업물 이미지/썸네일(4:3)로 플레이스홀더 교체
- (필요 시) Works/About 섹션 stacking sticky 재도전 — 각 섹션 100dvh 이하 재설계 필요

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
