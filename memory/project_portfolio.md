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

### 작업물별 별도 저장소 (iframe으로 포트폴리오에 임베드)
| 카드 ID | 저장소 | 라이브 URL |
|---------|--------|-----------|
| web-02 | https://github.com/Beomjeong/nte | https://beomjeong.github.io/nte/ |
| web-03 | https://github.com/Beomjeong/kakaopay_202606 | https://beomjeong.github.io/kakaopay_202606/ |

---

## 구현 현황 (2026-06-06 기준)

### 완료된 것
- `/index.html` — 전체 페이지 구조
  - Header (스크롤 시 blur 전환, nav 호버 언더라인)
  - **Nav 로고**: `assets/logo_beomjeong.svg` img 태그로 교체 (height: 26px)
  - Hero (리뉴얼 완료 — 아래 상세)
  - Works (탭 필터 All/Web/Video/3D/Printing + 카드 + 호버 오버레이)
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
- works: `margin-top: 100dvh; position: relative; z-index: 2; border-radius: 20px 20px 0 0`
- about: `position: relative; z-index: 3; border-radius: 20px 20px 0 0`
- contact: `position: relative; z-index: 4; background: #0d0d0d` (다크 배경)

### Contact 배경
- 다크 배경 `#0d0d0d` + `<canvas id="constellationCanvas">` 내장
- 별자리 파티클 효과: accent 컬러(`0,229,184`) 파티클 90개, 연결선 거리 140px
- 마우스 인터랙션: 마우스 주변 파티클과 연결선 추가 표시

### Works 모달 시스템
- 카드 클릭 → 전체화면 모달 (97dvh, 아래서 슬라이드업 GSAP 애니메이션)
- 닫기: X 버튼 / ESC / 배경 클릭
- 모달 헤더 고정 (카테고리 · 제목 · 툴 · 기여도) + 본문 스크롤
- `MODAL_DATA` 객체로 카드 데이터 관리
- 카드 썸네일 비율: `4:3`

### Viewer Modal — `type: 'viewer'`
전체화면 뷰어 팝업. web-01~03 카드에 적용.

**구조:**
- `#workViewer` — position:fixed fullscreen overlay (z-index: 300)
- `#viewerImgWrap` — 스크롤 영역 (flex:1, overflow-y:auto, 스크롤바 숨김)
- `#viewerImgStack` — 이미지 스택 (CSS transition:opacity 0.2s)
- `#viewerBannerGrid` — 배너 2열 그리드 (position:absolute, is-active 클래스로 토글)
- `#viewerIframe` — 외부 페이지 임베드 (position:absolute, is-active 클래스로 토글)
- `#viewerPanel` — 하단 정보 패널 (liquid glass 디자인, collapsed 클래스로 접기/펼치기)

**뷰 타입별 동작:**
| type | 콘텐츠 | 스크롤 감지 방법 |
|------|--------|----------------|
| 이미지 (default) | viewerImgStack에 img 렌더 | viewerImgWrap.scroll 이벤트 |
| banner | viewerBannerGrid에 그리드 렌더 | viewerBannerGrid.scroll |
| iframe | viewerIframe src 설정 | iframe → postMessage → window.message 이벤트 |

**하단 패널 스크롤 숨김:**
- 패널이 `collapsed` 상태일 때만 작동
- 스크롤 다운 & scrollTop > 40 → `scroll-hidden` 클래스 추가 → `translateY(100%)`
- 스크롤 업 → 패널 복귀

**등록 카드:**
- `web-01` — PC 5장 / MO 5장 (max-width:720px) / Banner 6장 2열 그리드 (이미지 뷰)
- `web-02` — nte 랜딩 / Banner (iframe 뷰 + banner 뷰)
- `web-03` — kakaopay 랜딩 / Banner (iframe 뷰 + banner 뷰)

---

## ⚠️ 버그 이력 및 해결 과정 (2026-06-06)

### 문제
- web-03 (kakaopay): 로컬(`npm run dev`)에서는 패널 스크롤 숨김 작동, GitHub Pages에서 안 됨
- web-02 (nte): 로컬에서 안 됨, GitHub Pages에서 작동

### 원인 분석
**환경별 iframe 스크롤 감지 메커니즘의 차이:**

| 환경 | 동일 오리진 여부 | iframe → viewerImgWrap 스크롤 체이닝 |
|------|----------------|--------------------------------------|
| 로컬 (`localhost`) | 크로스 오리진 | ❌ 차단 (브라우저 보안) |
| GitHub Pages | 동일 오리진 (`beomjeong.github.io`) | ✅ 발생 |

- **스크롤 체이닝**: 동일 오리진 iframe에서 스크롤 이벤트가 부모의 `viewerImgWrap`으로 전파됨. 단, `viewerImgStack`에 이전 뷰어 세션의 이미지가 남아 있을 때만 발생.
- **postMessage**: iframe 페이지가 `window.parent.postMessage({type:'scroll', y:window.scrollY}, '*')` 전송 시 작동. 크로스/동일 오리진 모두 작동.

**각 카드 상태 (수정 전):**
- nte: postMessage 코드 **없음** → 로컬 감지 불가. GitHub Pages는 체이닝으로 우연히 작동.
- kakaopay: postMessage 코드 **있음** (2026-06-05 추가). 로컬은 postMessage로 작동. GitHub Pages는 체이닝 + postMessage 동시 발화로 **충돌** → 패널 숨김 실패.

**충돌 메커니즘:**
1. postMessage → `onViewerScroll(iframe.scrollY = 50)` → 패널 숨김 → lastScrollTop = 50
2. 체이닝 → `viewerImgWrap.scrollTop = 10` → `onViewerScroll(10)` → `10 > 50` FALSE → **패널 다시 표시** → lastScrollTop = 10
→ 매 스크롤마다 반복 → 패널이 숨겨지지 않음

### 수정 내역

**1차 시도 (잘못된 접근 — 되돌림):**
- portfolio `viewerImgWrap.scroll` 에서 iframe 활성 시 무시하는 분기 추가
- 결과: nte GitHub Pages에서 체이닝도 차단되어 패널 숨김 전면 중단. nte postMessage CDN 미반영 상태라 완전히 깨짐.

**최종 수정 (2026-06-06, commit `bf02e6a`):**
- `js/main.js` `switchView` 내 iframe 분기에 `viewerImgStack.innerHTML = ''` 추가
- iframe으로 전환 시 이미지 잔여물 즉시 제거 → `viewerImgWrap` 스크롤 불가 → 체이닝 원천 차단
- iframe 뷰는 **postMessage만** 사용하도록 일원화

**nte postMessage 추가 (commit `10bd56d` — nte 저장소):**
- `nte/index.html` 스크립트 끝에 scroll → postMessage 코드 추가
- kakaopay와 동일한 방식으로 포트폴리오 패널 연동

### ⏳ 미확인 사항 (2026-06-06 저녁 기준)
- 위 수정들이 실제로 양쪽 환경에서 모두 정상 작동하는지 **내일 직접 브라우저로 확인 필요**
- GitHub Pages CDN `max-age=600` (10분)이 만료된 후 테스트해야 정확함
- 확인 체크리스트:
  - [ ] web-02 로컬(`npm run dev`)에서 패널 스크롤 숨김 작동
  - [ ] web-02 GitHub Pages에서 패널 스크롤 숨김 작동
  - [ ] web-03 로컬에서 패널 스크롤 숨김 작동
  - [ ] web-03 GitHub Pages에서 패널 스크롤 숨김 작동
  - [ ] web-01(이미지 뷰) 패널 스크롤 숨김 여전히 작동하는지

---

## JS 구조
- `initBgEffect(section, opts)` — canvas 그리드 + blob (hero에만 적용)
- `initConstellation()` — contact 별자리 파티클 (IIFE)
- `scrambleTo(target)` — 텍스트 스크램블 함수
- `openViewer(id)` / `closeViewer()` — viewer 모달 열기/닫기
- `switchView(view, animate)` — 뷰 타입(이미지/배너/iframe) 전환
- `onViewerScroll(scrollTop)` — 패널 스크롤 숨김 핵심 함수
- GSAP ScrollTrigger — 섹션 리빌, 툴바 애니메이션, Works 카드 reveal

## Works 툴 아이콘 CSS 맵
```css
.tool-ps      → assets/ic_photoshop.svg
.tool-ai      → assets/ic_illustrator.svg
.tool-lr      → assets/ic_lightroom.svg
.tool-ae      → assets/ic_after_effects.svg
.tool-pr      → assets/ic_premiere_pro.svg
.tool-blender → assets/ic_blender.svg
.tool-figma   → assets/ic_figma.svg
.tool-claude  → assets/ic_claude.svg
```
HTML: `<li class="tool-ps" title="Photoshop"></li>` 형태로 사용

## 에셋 현황 (assets/)
- `logo_beomjeong.svg` (255×40) — nav 로고
- `favicon.png` — 파비콘
- `Thumbnail_800x400.jpg`, `Thumbnail_1200x630.jpg` — OG 이미지
- `ic_photoshop/illustrator/lightroom/after_effects/premiere_pro/blender/figma/claude.svg` — 툴 아이콘 8종

## 남은 것
- **[우선]** 내일 web-02/03 패널 스크롤 숨김 양쪽 환경에서 동작 확인 (위 체크리스트)
- Works 섹션 카드 추가 (web-04/05 등 실제 작업물 이미지/썸네일 등록)
- 이후 카테고리별 모달 레이아웃 (Video, 3D, Print) 순차 작업
- 프로필 사진 교체 (`.photo-placeholder` → `<img>`)
- 실제 작업물 썸네일(4:3)로 플레이스홀더 교체

## 파일 구조
```
portfolio2026/
├── index.html
├── css/style.css
├── js/main.js
├── assets/         ← SVG 아이콘, 로고, 썸네일 등
├── works/          ← 작업물 이미지
└── memory/         ← 프로젝트 메모 (git 포함)
```

## 작업 규칙 (필수)

1. **불분명한 게 있으면 반드시 물어보고 진행** — 추측으로 작업하지 말 것
2. **에셋 파일이 필요하면 사용자에게 요청** — 임의로 placeholder 처리하거나 생략하지 말 것
3. **커밋/푸시는 사용자가 요청할 때만** — 코드 수정 후 자동으로 실행하지 말 것

**Why:** 스타트업 중심 지원이므로 트렌디하고 인터랙티브한 느낌이 중요
**How to apply:** 과도한 장식보다 모션 퀄리티에 집중, 작업물이 주인공이 되도록 레이아웃 구성
