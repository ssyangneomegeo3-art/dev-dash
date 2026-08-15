# ⚡ DevDash (GitHub Profile & Repository Dashboard)

> **React 18, TypeScript, TanStack Query v5, Zustand**를 활용하여 구축한 고성능 GitHub 프로필 및 저장소 대시보드 웹 애플리케이션입니다.  
> 실시간 검색, 무한 스크롤, README 마크다운 뷰어, PAT(Personal Access Token) 연동 기반 API 요청 한도 확장 및 번들 최적화를 제공합니다.

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://ssyangneomegeo3-art.github.io/dev-dash/)
[![GitHub Pages](https://github.com/ssyangneomegeo3-art/dev-dash/actions/workflows/deploy.yml/badge.svg)](https://github.com/ssyangneomegeo3-art/dev-dash/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query/v5)
[![Zustand](https://img.shields.io/badge/Zustand-v5-443E38?logo=zustand&logoColor=white)](https://zustand.docs.pmnd.rs/)

🔗 **실서비스 배포 URL**: [https://ssyangneomegeo3-art.github.io/dev-dash/](https://ssyangneomegeo3-art.github.io/dev-dash/)

---

## 📌 주요 핵심 기능 (Key Features)

### 1. 🔍 유저 검색 및 실시간 인앱 필터링
* **스마트 검색창 & 최근 검색어**: 최근 검색한 5개 사용자명을 LocalStorage에 영구 저장하며 단일 클릭 재검색 및 개별 삭제 지원.
* **정규식 기반 키워드 하이라이팅**: 저장소 목록 내에서 검색어와 일치하는 텍스트를 `<mark>` 태그로 실시간 강조 표시.
* **다중 필터 & 정렬**: 사용 언어별 필터링 및 **최근 업데이트순 / 스타(Stars)순 / 포크(Forks)순** 실시간 정렬.
* **관심 저장소 📌 상단 고정**: 사용자가 핀 고정한 레포지토리를 최상단에 우선 배치.

### 2. ⚡ 비동기 데이터 패칭 & 무한 스크롤
* **TanStack Query v5 기반 캐싱**: 5분간 `staleTime`을 유지하여 불필요한 네트워크 요청 최소화.
* **useInfiniteQuery + IntersectionObserver**: 12개 단위 페이징과 뷰포트 교차 감지를 결합한 부드러운 무한 스크롤.
* **스켈레톤 로딩 UI**: 데이터 패칭 중 레이아웃 시프트(CLS)를 방지하는 다크/라이트 테마 대응 쉬머(Shimmer) 애니메이션.

### 3. 🔑 GitHub PAT 연동 & Rate Limit 실시간 게이지
* **API 요청 한도 83배 확장**: GitHub Personal Access Token을 안전하게 로컬에 등록하여 시간당 호출 한도를 **60회에서 5,000회**로 확장.
* **실시간 잔여량 시각화**: 잔여 API 한도 비율을 프로그레스 바 게이지와 컬러 상태(초록/빨강)로 시각화.

### 4. 📖 인앱 README.md 마크다운 뷰어
* **react-markdown & remark-gfm**: 저장소 이동 없이 앱 내부 모달에서 GitHub 스타일의 마크다운(표, 코드 블록, 인용구 등)을 즉시 렌더링.

### 5. 🎨 완벽한 다크/라이트 모드 동기화 & 모바일 반응형
* **CSS 토큰 시스템**: 순수 CSS 변수(`--bg-main`, `--bg-card` 등)를 정의하고 DOM(`<html>`)의 `data-theme` 및 클래스 동시 주입.
* **모바일 반응형 최적화**: 768px, 480px 미디어 쿼리를 통해 터치 타깃(44px) 확보 및 1열 그리드 재배치.

### 6. 🔔 전역 토스트(Toast) 알림 및 중복 방어
* 404 Not Found, 403 API Rate Limit 초과, 네트워크 단절 등 예외 상황 발생 시 사용자 친화적 토스트 알림 자동 발송.

---

## 🛠️ 기술 스택 및 아키텍처 (Tech Stack & Architecture)

* **UI & Framework**: React 18, Vite, TypeScript (Strict, verbatimModuleSyntax)
* **Server State**: @tanstack/react-query (v5) (캐싱, 무한 스크롤, 비동기 상태)
* **Client State**: Zustand (v5) + persist middleware (LocalStorage 연동)
* **Markdown Parser**: react-markdown, remark-gfm
* **Styling**: Pure CSS Variables (Light/Dark Theme Token System)
* **CI/CD**: GitHub Actions (deploy.yml) -> GitHub Pages

### 💡 상태 관리 관심사 분리 (Separation of Concerns)

| 구분 | 도구 | 담당 영역 |
| :--- | :--- | :--- |
| **서버 상태 (Server State)** | `TanStack Query` | 유저 프로필, 레포지토리 목록, Rate Limit, README 원문 패칭 및 5분 캐싱 관리 |
| **클라이언트 전역 상태** | `Zustand` | 검색 사용자명, 테마(`light`/`dark`), 최근 검색어 5개, 핀 고정 레포 ID, PAT 토큰 |
| **UI 피드백 상태** | `Zustand (useToastStore)` | 토스트 메시지 큐, 자동 타이머 소멸, 동일 에러 중복 방지 필터링 |

---

## 🚀 성능 최적화 (Performance Optimization)

1. **`React.lazy` & `<Suspense>` 기반 코드 분할(Code Splitting)**
   * 무거운 마크다운 파서가 포함된 `ReadmeModal`과 `TokenModal`을 초기 번들에서 제외하고, 사용자가 버튼을 클릭하여 모달을 열었을 때만 비동기 로드하도록 최적화.
2. **Rollup 청크 분할 (`manualChunks`)**
   * 자주 변경되지 않는 `vendor` (React, Zustand, Query)와 `markdown` (`react-markdown`, `remark-gfm`) 청크를 물리적으로 분리하여 브라우저 장기 캐싱 효율 극대화.

---

## 🔧 주요 트러블슈팅 및 해결 과정 (Engineering & Troubleshooting)

### 1. GitHub API 403 Rate Limit(시간당 60회) 병목 해결
* **문제**: 무한 스크롤과 실시간 검색을 테스트하는 과정에서 비인증 IP 한도인 60회가 순식간에 소진되는 문제 발생.
* **해결**: Zustand `persist` 스토어에 PAT 토큰 저장 공간을 마련하고, 모든 API 요청(`fetchGithubUser`, `fetchGithubRepos`, `fetchRepoReadme`)에 `Authorization: Bearer <token>` 헤더를 조건부 주입하도록 구조화하여 **한도를 5,000회로 확장**.

### 2. 비동기 에러 발생 시 토스트 알림 다중 발송 버그 해결
* **문제**: `App` 컴포넌트와 `TokenModal` 컴포넌트에서 동일한 커스텀 훅을 호출할 때, `userQuery.isError` 감지 리스너가 중복 실행되어 화면에 똑같은 토스트가 2개씩 뜨는 현상 발생.
* **해결**:
  1. `useGithubData` 훅 내부에 `useRef`를 도입하여 직전 에러 식별자(`username + message`)를 추적하고 중복 트리거를 방어.
  2. `useToastStore` 내부 `addToast` 액션에 동일한 메시지/타입이 큐에 이미 존재하는지 검사하는 방어 로직(Deduplication) 추가.

### 3. 모달 레이아웃 시프트 및 모바일 터치 영역 개선
* **문제**: 모바일 뷰포트에서 검색 버튼과 칩의 터치 영역이 협소하고, 모달 내부 스크롤 시 바깥 배경까지 함께 스크롤되는 이슈.
* **해결**: CSS 모바일 브레이크포인트(768px, 480px)를 설계하여 버튼 높이를 최소 44px 이상으로 보정하고, 모달 바디에 `-webkit-overflow-scrolling: touch` 및 독립 스크롤 영역 구축.

---

## 📂 프로젝트 디렉토리 구조 (Directory Structure)

```
src/
├── api/
│   └── github.ts             # GitHub REST API 통신 함수 (User, Repos, RateLimit, Readme)
├── components/
│   ├── Header.tsx            # 헤더 내비게이션, PAT 설정 모달 버튼, 테마 토글
│   ├── SearchBar.tsx         # 라운드 카드 스타일 유저네임 검색 폼
│   ├── RecentSearchTags.tsx  # 최근 검색어 칩 목록 및 개별 삭제
│   ├── UserProfileCard.tsx   # 유저 아바타, 바이오, 팔로워/팔로잉 상세 통계
│   ├── LanguageStats.tsx     # 저장소 언어 점유율 프로그레스 바 차트
│   ├── RepoList.tsx          # 실시간 검색/하이라이팅, 언어 필터, 3종 정렬, 핀 고정, 무한 스크롤
│   ├── SkeletonLoader.tsx    # 쉬머 애니메이션 스켈레톤 로딩 UI
│   ├── TokenModal.tsx        # GitHub PAT 입력 및 Rate Limit 실시간 게이지 모달
│   ├── ReadmeModal.tsx       # react-markdown 기반 저장소 README 렌더링 모달
│   └── Toast.tsx             # 전역 토스트 피드백 컨테이너
├── hooks/
│   └── useGithubData.ts      # TanStack Query 통합 비동기 데이터 패칭 및 에러 핸들링 훅
├── store/
│   ├── useGithubStore.ts     # Zustand 전역 스토어 (검색어, 테마, 핀, 토큰)
│   └── useToastStore.ts      # Zustand 토스트 알림 큐 스토어
├── types/
│   ├── github.ts             # GitHub API 데이터 인터페이스
│   └── toast.ts              # 토스트 알림 타입 정의
├── App.tsx                   # 메인 대시보드 레이아웃 및 지연 로딩 모달 오케스트레이터
├── index.css                 # 다크/라이트 CSS 토큰 및 전역 스타일시트
├── main.tsx                  # QueryClientProvider 루트 마운트
└── vite.config.ts            # Vite 번들러 설정 & Rollup 청크 분할
```

---

## 💻 로컬 실행 가이드 (Getting Started)

1. 저장소 클론 및 패키지 설치:
   git clone [https://github.com/ssyangneomegeo3-art/dev-dash.git](https://github.com/ssyangneomegeo3-art/dev-dash.git)
   cd dev-dash
   npm install

2. 로컬 개발 서버 실행:
   npm run dev

3. 타입 검사 및 프로덕션 빌드:
   npm run build

4. 빌드 결과물 로컬 미리보기:
   npm run preview

---

## 📄 라이선스 (License)

This project is licensed under the MIT License.