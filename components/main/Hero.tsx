import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        모두의 즐거움, <span className="text-primary">koofy</span>에서 시작하세요!
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
        심리테스트부터 재미있는 미니게임까지, 오늘은 어떤 걸 해볼까요?
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="/testhub"
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
        >
          심리테스트 바로가기
        </Link>
        <Link
          href="/games"
          className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          게임 즐기기
        </Link>
      </div>
    </section>
  );
}