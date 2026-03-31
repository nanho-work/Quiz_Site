import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-8">
      <header className="rounded-lg border border-border/30 bg-card p-8 md:p-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          koofy 간편계산기
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          실무에 바로 쓰는 계산기를 빠르게 제공합니다. 연봉 실수령, 최저임금,
          종합소득세, 3.3% 환급까지 한 번에 확인해보세요.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            href: "/salary-calculator",
            title: "연봉 실수령 계산기 (2026년 버전)",
            description: "세전/세후 월급과 공제 항목을 한 번에 계산",
          },
          {
            href: "/minimum-wage-calculator",
            title: "최저임금 계산기 (2026)",
            description: "시급, 주휴수당, 월 예상 급여를 즉시 계산",
          },
          {
            href: "/income-tax-calculator",
            title: "종합소득세 간편계산기",
            description: "예상 종합소득세를 빠르게 확인",
          },
          {
            href: "/calculators/refund-33",
            title: "3.3% 환급 계산기",
            description: "원천징수 환급 예상 금액 계산",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border border-border/30 bg-card p-5 hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
