# 쿠피 이미지 웹 반영 — 2026-10-17

실제 Quiz_Site 소스에 반영 완료. 사용자가 commit/push 및 Vercel 배포한다. 기존 웹/쿠피리더 정책을 공용으로 사용하지 않고 모바일 앱 전용 정책을 제공한다.

- 개인정보: https://www.koofy.co.kr/koofy-image/privacy
- 지원: https://www.koofy.co.kr/koofy-image/support
- 앱 소개: https://www.koofy.co.kr/koofy-image/app
- 기존 /koofy-image 브라우저 변환기는 유지.
- 개인정보 서비스 선택 메뉴에 쿠피 이미지 추가. KO/EN/JA, 중국어 선택 시 영어 본문.
- 운영명 쿠피랩, Gmail 직접 문의만 사용, 문의 처리 완료 후 1년 보관/삭제.
- 정책 시행일은 2026-10-17로 준비. 실제 게시가 늦어지면 lib/legal/koofyImageContent.json의 세 언어 날짜와 앱 docs/legal 원고를 실제 게시일로 수정.
- Google 메일 처리 설명은 https://policies.google.com/privacy 참고. 광고/분석 SDK가 없는 현재 앱 동작 기준이며 SDK 추가 시 정책 재검토.
- 앱의 개인정보/지원 URL 활성화는 배포 후 공개 응답 확인 뒤 진행. 현재 공개되었다고 기록하지 않음.

## 검증

- npx tsc --noEmit 통과.
- npm run build 통과: 59 정적 페이지, 기존의 별도 이미지 경고 2개만 존재.
- localhost:3095에서 개인정보 KO/EN/JA 전환, Gmail 및 보관기간 표시, 지원 페이지와 앱 소개 이미지/좁은 화면 확인.
- commit/push/배포 없음.

## 2026-10-17 메인·제품·정책 탐색 연결

- 공통 제품 데이터에 쿠피 이미지를 추가하여 /products와 /policies에 노출.
- 메인 대표 제품에 이미지 카드 추가, 기존 웹 도구 바로가기 유지.
- 앱 스토어 출시로 오인하지 않도록 웹 무료 이용·앱 출시 준비 상태를 KO/EN/JA/ZH에 명시.
- 앱 소개·개인정보·지원 경로를 sitemap에 추가.
- npm run build 통과(기존 이미지 경고 2개). 로컬 브라우저에서 /, /products, /policies의 카드 및 연결 확인.
- 사용자 commit/push 필요, 자동 배포하지 않음.
