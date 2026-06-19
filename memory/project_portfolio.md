---
name: project-portfolio
description: "포트폴리오 사이트(portfolio2026) 구현 현황, 구조, 완료/미완료 작업"
metadata: 
  type: project
---

## 프로젝트 개요

콘텐츠 디자이너 KIM BEOM JEONG의 포트폴리오 사이트. Vanilla JS/HTML/CSS, GSAP 3 사용. 프레임워크 없음.

- 주요 CSS 변수: `--accent: #00E5B8`, `--font-en: 'DM Sans'`, `--font-ko: 'Noto Sans KR'`
- Works, About, Contact 섹션으로 구성
- 배포: `https://beomjeong.github.io/portfolio2026/`

## 주요 파일 구조

- `index.html` — 전체 마크업
- `css/style.css` — 스타일 (WORK VIEWER MODAL 섹션 포함)
- `js/main.js` — 인터랙션 로직 (MODAL_DATA, viewer IIFE)
- `assets/` — favicon, logo, clip.png, profile.jpg 등 공용 에셋
- `works/` — 작업물별 이미지 에셋 폴더
- `memory/` — 세션 간 컨텍스트 유지용 메모리 파일 (git 추적)

## 등록된 카드 현황 (2026-06-19 기준)

- **web-01~06, 08~11**: 등록 완료
- **web-07**: `display:none` 임시 숨김 (작업 미완료)
- **print-01**: 양양 스파리조트 프로모션 포스터 — hanging 타입
- **print-02**: 양양 스파리조트 FnB 메뉴판 — centered image 타입 (`works/poster_menu/`)
- **print-03**: PC방 게임 오프라인 홍보 포스터 — hanging 타입 (`works/poster_gamepromo/`)
- **print-04**: 신문광고 — hanging 타입 (`works/print_newspaper/`)
- **print-05**: 수제청 라벨 — centered image 타입 (`works/print_label/`)
- **video-01**: 숏폼 콘텐츠 모음 — shortform 타입, 5개 YouTube Shorts (`works/shortform_01/`)
- **video-02**: airbnb 숙소 PR Video — shortform 타입, 2개 YouTube watch URL (`works/longform_01/`)
- **3d-01**: `display:none` 임시 숨김 + 3D 탭 버튼도 숨김
- **web-10**: 스마트스토어 파티풍선 — seamless 타입 (`works/smartstore_lalaposh/`)

## Viewer Modal (work 카드 팝업 유형)

`MODAL_DATA[id].type === 'viewer'`인 카드에 사용하는 전체화면 팝업.

**구조:**
- `#workViewer` — fullscreen overlay (position: fixed, z-index: 300, background: #000)
- `#viewerImgWrap` — 이미지 스크롤 영역 (flex: 1, overflow-y: auto, isolation: isolate, background: #000, 스크롤바 숨김)
- `#viewerImgStack` — 이미지/콘텐츠 영역 (CSS transition: opacity 0.2s)
- `#viewerBannerGrid` — 배너 2열 그리드 (position: absolute, is-active 클래스로 표시)
- `#viewerPanel` — 하단 정보 패널 (collapsed 클래스로 접기/펼치기, white-space: pre-line on .viewer-desc)
- `#sfVideoOverlay` — shortform 유튜브 라이트박스 (is-open 클래스로 표시)
- `#sfCursorTip` — shortform 커서 "Click" 툴팁 (position: fixed, visible 클래스로 표시)

**닫기 버튼:**
- `#viewerClose.viewer-close` — viewer overlay 닫기 버튼
  - 다크 버전(기본): `color: rgba(255,255,255,0.8)`, `background: rgba(0,0,0,0.6)`
  - 밝은 버전(`.is-light-bg` 또는 `.is-hanging`): `color: rgba(0,0,0,0.8)`, `background: rgba(255,255,255,0.6)`
  - `is-light-bg` 토글 기준: `switchView`에서 `!!view.bg` (boolean true 명시 필요)
  - `view.bg: true`인 뷰: web-03 Landing Page·Banner, web-05 Landing Page·Banner (밝은 버전)
  - web-02, 04, 06: `bg` 없음 → 다크 버전 (iframe 컨텐츠가 어두운 게임 테마이므로 흰 글씨 적합)
- `.modal-close` — 별도 모달 팝업 닫기 버튼, `background: rgba(255,255,255,0.3)`

**View 타입 (switchView):**
- `image` — 세로 스크롤 이미지 스택
- `iframe` — 외부 페이지 임베드
- `banner` — 2열 배너 그리드
- `cardnews` — sticky 카드 스택 (세로스크롤로 카드가 위로 쌓임, `initCardnewsStack`)
- `hanging` — 포스터 걸이대 뷰어 (세로스크롤 → 가로이동, `initHangingScroll`)
- `shortform` — 가로 스크롤 썸네일 + YouTube 라이트박스 (`initShortformScroll`)
- `centered: true` — centered image 타입 (view.type 없이 view.centered로 지정)

**hanging 타입 구조:**
- `.hanging-scene` (sticky, full height) > `.hanging-track` (flex row, translateX로 가로이동)
- `.hanging-set` 1개 = 끈(`.hs-string`) 2개 + 집게(`.hs-clip`, `assets/clip.png`) 2개 + 포스터(`.hs-poster`) 1개
- CSS 변수 `--string-h`, `--poster-h`를 JS에서 scene에 인라인으로 설정
- 첫 포스터 가운데서 시작, 마지막 포스터 가운데서 끝나는 center-start/center-end 스크롤 로직
- **모바일 가로 스와이프 지원**: touchstart/touchmove/touchend 핸들러로 수평 스와이프 → scrollTop 변환, 방향 감지(6px 임계값) + 모멘텀(감속 0.92)
- `killHangingST()`: scroll·touch 핸들러 및 모멘텀 rAF 제거, height 초기화, is-hanging 클래스 제거 → closeViewer onComplete에서 호출

**shortform 타입 구조:**
- `.shortform-scene` (sticky, dark bg) > `.shortform-track` (flex row, translateX로 가로이동)
- `.sf-card` > `.sf-thumb-wrap` > `img.sf-thumb` + `.sf-info` (title, purpose·equipment)
- hanging과 동일한 center-start/center-end 로직 사용
- 썸네일 높이: JS에서 `--sf-thumb-h` CSS 변수로 scene에 설정 (`sceneH * 0.6` 현재값)
- **중요**: `#viewerImgStack img { height: auto }` (특이도 101)가 `.sf-thumb { height: var(--sf-thumb-h) }` (특이도 10)를 덮어씀 → `#viewerImgStack.is-shortform img.sf-thumb`에 `height: var(--sf-thumb-h, 55vh)` 명시 필요 (특이도 121로 해결)
- 모바일(≤600px): track gap 120px, padding 0 24px
- 초기 flicker 방지: setup() 시작 시 `gsap.set(track, { opacity: 0 })`, 위치 계산 후 페이드인
- YouTube ID 추출 정규식: `/(?:shorts\/|[?&]v=)([^&/]+)/` (Shorts URL과 watch URL 모두 지원)
- `purpose` 필드 optional: `[item.purpose, item.equipment].filter(Boolean).join(' · ')`

**centered image 타입:**
- `view.centered: true`일 때 `#viewerImgStack`에 `is-image-center` 클래스 추가
- flex column, center, gap 20px, padding 24px 0
- img: `width: 1300px; max-width: 100%; height: auto`
- `view.maxWidth` 지정 시 img에 해당 max-width 적용 (web-08, web-11: `maxWidth: '700px'`)

**모바일 뷰어 반응성 개선 (2026-06-19):**
- `openViewer`: overlay 즉시 표시 후 콘텐츠 빌드를 rAF로 지연 (`_pendingOpenRaf`)
- card-link·viewerClose에 touchend 핸들러 추가 (iOS 터치 딜레이 대응, `_tapFired` 가드)
- `_viewerClosing` 가드: 더블탭 시 `closeViewer` 중복 호출 방지 (페이지 최상단 이동 버그 수정)
- `applyPadding`: `ScrollTrigger.refresh()` 전체 → `cardSTs` 범위 한정 refresh

**애니메이션:**
- 오버레이 열기/닫기: GSAP opacity fade (0.35s/0.3s)
- 탭 전환: CSS transition opacity 0.2s + setTimeout 200ms

**스크롤 잠금:** iOS Safari 대응 position:fixed 패턴

**ESC 키:** sfVideoOverlay 열려있으면 먼저 닫고, 아니면 viewer 닫음

## 알려진 해결된 버그

- 모달 열고닫을 때 페이지 가로 흔들림 → `scrollbar-gutter: stable` on html
- 배너 그리드 스크롤바로 인한 내부 흔들림 → `scrollbar-width: none`
- PC↔MO 전환 시 스케일 artifact → GSAP 대신 CSS transition + setTimeout
- iOS 무한 스크롤 → position:fixed 스크롤 잠금 패턴
- iframe 패널 scroll-hidden 미동작 → contentWindow scroll 직접 바인딩
- bg 있는 카드(white bg) 닫기 시 검정 번쩍임 → background/is-light-bg 초기화를 onComplete으로 이동
- cardnews 마지막 카드 끝까지 안 올라옴 → 이미지 로드 후 `max(0, viewerH - lastCard.offsetHeight)` padding-bottom 계산
- cardnews z-index > close 버튼 z-index로 닫기 버튼 클릭 안됨 → `viewer-img-wrap`에 `isolation: isolate`
- hanging 닫을 때 이미지 확대 번쩍임 → `killHangingST()`를 closeViewer `onComplete`으로 이동
- shortform 열릴 때 이미지 좌상단 몰림 → `gsap.set(track, { opacity: 0 })` 후 위치 계산 완료 시 페이드인
- hanging 투명 PNG 그림자 어색함 → `filter: drop-shadow` 사용
- **모바일 뷰어 스크롤 전혀 안됨** → `#sfVideoOverlay`에 `visibility: hidden` 병행 필요. `pointer-events: none`만으로는 iOS 터치 스크롤 라우팅 문제 해결 안 됨.
- **web-08, web-11 모바일 뷰어 느림** → cardnews 타입 자체가 성능 문제 유발 → centered 타입으로 변경 (max-width: 700px)
- **shortform 썸네일 크기 미적용** → `#viewerImgStack img { height: auto }` (특이도 101)가 `.sf-thumb` 규칙 덮어씀 → `#viewerImgStack.is-shortform img.sf-thumb`에 height 명시로 해결
- **hanging 모바일 직관성 부족** → 가로 스와이프 핸들러 추가로 해결

## 남은 작업 (2026-06-19 기준)

- web-07 작업 완료 후 숨김 해제
- 3d-01 작업 완료 후 숨김 해제
- About, Contact 섹션 마무리

**Why:** 세션 간 컨텍스트 유지를 위해 기록. 다른 환경에서도 접근 가능하도록 git으로 관리.
**How to apply:** 다음 세션에서 viewer modal 관련 작업 시 이 구조와 해결된 버그 목록을 먼저 참고할 것.

## 파일 구조

works 폴더 내 에셋:
- `works/poster_resort/` — print-01 hanging
- `works/poster_menu/` — print-02 centered
- `works/poster_gamepromo/` — print-03 hanging
- `works/print_newspaper/` — print-04 hanging
- `works/print_label/` — print-05 centered
- `works/shortform_01/` — video-01 (썸네일)
- `works/longform_01/` — video-02 (썸네일)
- `works/webpromo_forever/` — web-08 centered (max-width: 700px)
- `works/card_flower/` — web-11 centered (max-width: 700px)
