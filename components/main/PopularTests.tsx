import React from "react";
import Link from "next/link";
import { tests } from "../../data/tests";

export default function PopularTests() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">인기 심리테스트 🧠</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tests.slice(0, 3).map((test) => (
          <div key={test.id} className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden">
            <img src={test.image} alt={test.title} className="w-full object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg">{test.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{test.description}</p>
              <Link
                href={`/test/${test.id}`}
                className="text-primary font-semibold hover:underline"
              >
                시작하기 →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}