# Quiz_Site

## 프로젝트 설명
Quiz_Site는 Next.js로 구축된 현대적인 웹 애플리케이션으로 Tailwind CSS를 사용하여 스타일링되었습니다. Next.js App Router를 활용하여 직관적이고 확장 가능한 프로젝트 구조를 제공하며, 빠르고 동적인 퀴즈 경험을 가능하게 합니다.

## 프로젝트 구조 (Next.js App Router 스타일)
```
/app
  /api        # API 경로
  /components # React 컴포넌트
  /styles     # Tailwind 및 전역 스타일
  /quiz       # 퀴즈 관련 페이지 및 컴포넌트
  layout.js   # 루트 레이아웃
  page.js     # 홈 페이지
/public       # 정적 자산
/next.config.js
/postcss.config.js
/tailwind.config.js
/tsconfig.json (TypeScript 사용 시)
```

## 의존성
- next (최신 안정 버전)
- react (최신 안정 버전)
- react-dom (최신 안정 버전)
- tailwindcss (최신 안정 버전)
- postcss (최신 안정 버전)
- autoprefixer (최신 안정 버전)

## 개발 의존성
- typescript (최신 안정 버전, TypeScript 사용 시)
- eslint (최신 안정 버전)
- eslint-config-next (최신 안정 버전)

## 설치

안정적인 버전의 Next.js + Tailwind CSS 프로젝트를 생성하려면 다음을 실행하세요:

```bash
npx create-next-app@latest quiz_site --typescript
cd quiz_site
npm install tailwindcss@latest postcss@latest autoprefixer@latest
npx tailwindcss init -p
```

`tailwind.config.js`를 업데이트하고 전역 CSS에 Tailwind 지시문을 추가하여 Tailwind CSS를 구성하세요.

## 프로젝트 실행

모든 의존성을 설치하세요:

```bash
npm install
```

개발 서버를 시작하세요:

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 앱을 확인할 수 있습니다.

## 배포

배포를 위해, Quiz_Site는 Next.js 제작자가 만든 플랫폼인 Vercel에 최적화되어 있습니다. GitHub 저장소를 Vercel에 연결하고 배포 지침을 따르면 쉽게 프로젝트를 배포할 수 있습니다. Vercel은 Next.js 애플리케이션의 모든 빌드 및 최적화 단계를 자동으로 처리합니다.