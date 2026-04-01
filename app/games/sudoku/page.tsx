// app/sudoku/page.tsx
import Head from "next/head";
import SudokuDescription from "../../../components/game/sudoku";
export default function SudokuPage() {
  return (
    <>
      <Head>
        <title>무료 스도쿠 게임 - Koofy</title>
        <meta name="description" content="무료로 즐기는 온라인 스도쿠. 쉬움부터 어려움까지 다양한 난이도로 두뇌 훈련을 해보세요." />
        <meta property="og:title" content="Koofy 스도쿠 게임" />
        <meta property="og:description" content="무료 스도쿠 퍼즐 게임. 난이도별 퍼즐과 힌트 기능 제공." />
        <meta property="og:image" content="/images/sudoku-thumbnail.png" />
      </Head>

      <main style={{ textAlign: "center", padding: "2rem" }}>
        <div
          style={{
            position: "relative",
            width: "600px",
            height: "100vh", // 화면 높이의 80% 차지
            margin: "0 auto",
            padding: "10px", // ← 안전하게 프레임과 경계 사이 여백
            boxSizing: "border-box", // padding 포함 크기 계산
          }}
        >
          <iframe
            src="https://sudoku-flutter.vercel.app/"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>

        <SudokuDescription />
      </main>
    </>
  );
}