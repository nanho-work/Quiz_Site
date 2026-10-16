import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "쿠피 이미지 | 오픈소스 안내",
  alternates: { canonical: "/koofy-image/licenses" },
};
export default function Page() {
  return (
    <article className="prose prose-slate mx-auto max-w-3xl rounded-2xl border bg-white p-6 sm:p-10">
      <Link href="/koofy-image">← 쿠피 이미지 / Koofy Image</Link>
      <h1>오픈소스 안내</h1>
      <p>
        쿠피 이미지는 아래 오픈소스를 사용합니다. 사진 처리에 필요한 프로그램은
        이 사이트에서 내려받아 사용자 기기에서 실행됩니다.
      </p>
      <ul>
        <li>
          <a href="https://github.com/Donaldcwl/browser-image-compression/tree/2.0.2">
            browser-image-compression 2.0.2
          </a>{" "}
          — 압축 /{" "}
          <a href="/licenses/koofy-image/browser-image-compression-MIT.txt">
            MIT
          </a>
        </li>
        <li>
          <a href="https://github.com/101arrowz/fflate">fflate 0.8.3</a> — ZIP /{" "}
          <a href="/licenses/koofy-image/fflate-MIT.txt">MIT</a>
        </li>
        <li>
          <a href="https://github.com/jamsinclair/jSquash">
            @jsquash/webp 1.5.0
          </a>{" "}
          — WebP 인코딩 보완 /{" "}
          <a href="/licenses/koofy-image/jsquash-Apache-2.0.txt">Apache-2.0</a>,{" "}
          <a href="/licenses/koofy-image/libwebp-BSD.txt">libwebp BSD</a>
        </li>
        <li>
          <a href="https://github.com/GoogleChromeLabs/wasm-feature-detect">
            wasm-feature-detect
          </a>{" "}
          — WebAssembly 기능 감지 /{" "}
          <a href="/licenses/koofy-image/wasm-feature-detect-Apache-2.0.txt">
            Apache-2.0
          </a>
        </li>
        <li>
          <a href="https://github.com/hoppergee/heic-to/tree/v1.5.2">
            heic-to 1.5.2
          </a>{" "}
          — HEIC/HEIF 디코딩 /{" "}
          <a href="/licenses/koofy-image/heic-to-LGPL-3.0.txt">
            LGPL-3.0-or-later
          </a>
          . libheif 1.22.2 및 libde265를 포함합니다.
        </li>
      </ul>
      <h2>HEIC 디코더와 소스 코드</h2>
      <p>
        HEIC 디코더는 변경하지 않은 별도 JavaScript 모듈로 제공됩니다. LGPL
        구성요소를 수정·디버깅·교체하기 위한 권리는 해당 라이선스에 따릅니다.
        디코더 파일의 경로는 <code>/vendor/koofy-image/heic-to-1.5.2.js</code>
        입니다.
      </p>
      <ul>
        <li>
          <a href="/licenses/koofy-image/heic-to-1.5.2-source.tar.gz">
            heic-to 소스 및 빌드 안내
          </a>
        </li>
        <li>
          <a href="/licenses/koofy-image/libheif-1.22.2-source.tar.gz">
            libheif 1.22.2 소스
          </a>{" "}
          ·{" "}
          <a href="https://github.com/strukturag/libheif/tree/v1.22.2">
            원본 저장소
          </a>
        </li>
        <li>
          <a href="/licenses/koofy-image/libde265-1.0.16-source.tar.gz">
            libde265 1.0.16 소스
          </a>{" "}
          ·{" "}
          <a href="https://github.com/strukturag/libde265/tree/v1.0.16">
            원본 저장소
          </a>
        </li>
        <li>
          <a href="/licenses/koofy-image/GPL-3.0.txt">GNU GPL v3 전문</a> ·{" "}
          <a href="/licenses/koofy-image/LGPL-3.0.txt">GNU LGPL v3 전문</a>
        </li>
      </ul>
      <p>
        코덱 소스의 빌드 안내와 개별 저작권 고지도 함께 확인할 수 있습니다.
        제품에 관한 문의:{" "}
        <a href="mailto:koofylab@gmail.com">koofylab@gmail.com</a>
      </p>
    </article>
  );
}
