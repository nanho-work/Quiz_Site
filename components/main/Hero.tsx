import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        모두의 즐거움, <span className="text-primary">koofy</span>에서 시작하세요!
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
        다양한 심리테스트로 나를 알아보고, 재미있는 결과를 확인해보세요.
      </p>
      <div className="flex justify-center">
        <Link
          href="/testhub"
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
        >
          심리테스트 바로가기
        </Link>
      </div>
    </section>
  );
}
