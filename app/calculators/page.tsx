import Link from "next/link";

const calculators = [
  {
    href: "/calculators/income-tax",
    title: "종합소득세 간편계산기",
    description: "예상 종합소득세를 빠르게 계산해보세요.",
  },
  {
    href: "/calculators/refund-33",
    title: "3.3% 환급 계산기",
    description: "3.3% 원천징수 환급 예상 금액을 확인해보세요.",
  },
  {
    href: "/salary-calculator",
    title: "연봉 실수령 계산기 (2026년 버전)",
    description: "연봉 기준 월 실수령액을 간편하게 계산해보세요.",
  },
  {
    href: "/minimum-wage-calculator",
    title: "최저임금 계산기 (2026)",
    description: "시급, 주급, 주휴수당, 월급을 빠르게 계산해보세요.",
  },
];

export default function CalculatorsPage() {
  return (
    <section>
      <h1 className="text-3xl md:text-4xl font-bold mb-3">간편계산기</h1>
      <p className="text-muted-foreground mb-8">필요한 계산기를 선택해 빠르게 확인해보세요.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calculators.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border bg-card p-5 hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
