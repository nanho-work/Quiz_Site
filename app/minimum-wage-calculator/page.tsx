import type { Metadata } from "next";
import Link from "next/link";
import MinimumWageCalculatorClient from "../../components/calculators/MinimumWageCalculatorClient";

export const metadata: Metadata = {
  title: "최저임금 계산기 (2026) | 시급·월급 자동 계산",
  description:
    "2026년 최저임금을 기준으로 시급, 월급, 주휴수당까지 간편하게 계산해보세요. 아르바이트 및 근로자 필수 계산기.",
  alternates: {
    canonical: "/minimum-wage-calculator",
  },
  openGraph: {
    title: "최저임금 계산기 (2026) | 시급·월급 자동 계산",
    description:
      "2026년 최저임금을 기준으로 시급, 월급, 주휴수당까지 간편하게 계산해보세요. 아르바이트 및 근로자 필수 계산기.",
    url: "https://www.koofy.co.kr/minimum-wage-calculator",
    type: "website",
  },
  twitter: {
    title: "최저임금 계산기 (2026) | 시급·월급 자동 계산",
    description:
      "2026년 최저임금을 기준으로 시급, 월급, 주휴수당까지 간편하게 계산해보세요. 아르바이트 및 근로자 필수 계산기.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "2026년 최저임금은 얼마인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2026년 최저임금은 시급 10,320원 기준으로 계산됩니다. 이 페이지의 최저임금 계산기에 기본값으로 반영되어 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "주휴수당은 언제 받을 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "일반적으로 주 소정근로시간이 15시간 이상이면 주휴수당 대상이 됩니다. 본 계산기는 주 근무시간 15시간 이상일 때 주휴수당을 자동으로 포함합니다.",
      },
    },
  ],
};

export default function MinimumWageCalculatorPage() {
  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">최저임금 계산기</h1>
        <p className="text-muted-foreground">
          2026년 시급 기준으로 시급 계산, 주휴수당 계산, 아르바이트 월급 추정을 한 번에 확인해보세요.
        </p>
      </header>

      <MinimumWageCalculatorClient />

      <section className="space-y-4 text-sm text-muted-foreground">
        <h2 className="text-xl font-bold text-foreground">2026년 최저임금 기준</h2>
        <p>
          2026년 최저임금 계산기에서는 시급 10,320원을 기본값으로 사용합니다. 최저임금 계산기는 단순히 시급만 보는 도구가 아니라,
          실제 근무 패턴을 반영해 주급과 월급까지 확인할 수 있는 실무형 도구입니다. 특히 아르바이트 월급을 계산할 때는 하루 근무시간,
          주 근무일수, 주휴수당 발생 여부에 따라 체감 수입이 크게 달라집니다. 그래서 시급 계산만 따로 하지 않고, 주 단위와 월 단위 금액을
          함께 비교하는 것이 중요합니다. 이 페이지는 입력값 3개만 사용해 빠르게 결과를 보여주기 때문에, 면접 전 급여 확인이나 근무표 조정 시
          즉시 참고하기 좋습니다.
        </p>

        <h2 className="text-xl font-bold text-foreground">최저임금 월급 계산 방법</h2>
        <p>
          계산 순서는 간단합니다. 먼저 주 근무시간을 하루 근무시간과 주 근무일수로 계산하고, 이를 시급과 곱해 기본 주급을 구합니다.
          이후 주휴수당 계산 조건을 확인한 뒤 총 주급을 산출합니다. 마지막으로 총 주급에 월 환산 계수 4.345를 곱하면 월 예상 급여가 계산됩니다.
          이렇게 계산하면 주차별 근무시간이 크게 다르지 않은 일반적인 근로 형태에서 월급 추정치를 빠르게 확인할 수 있습니다.
          최저임금 계산기는 복잡한 급여표를 열지 않아도 입력 즉시 결과가 바뀌므로, 여러 조건을 바꿔가며 비교하기에도 편리합니다.
        </p>

        <h2 className="text-xl font-bold text-foreground">주휴수당 계산 방법</h2>
        <p>
          주휴수당 계산은 주 근무시간 15시간 이상인지 여부가 핵심입니다. 이 계산기에서는 주 근무시간이 15시간 이상이면
          시급 × 하루 근무시간을 주휴수당으로 자동 반영합니다. 반대로 15시간 미만이면 주휴수당은 0원으로 처리됩니다.
          따라서 같은 시급이라도 근무시간 구성에 따라 아르바이트 월급 차이가 발생할 수 있습니다. 결과 화면에서 주휴수당 포함 여부와
          금액을 별도로 보여주기 때문에, 사용자는 어떤 조건에서 월급이 올라가는지 직관적으로 확인할 수 있습니다. 최저임금 계산기를
          활용해 시급 계산 결과와 주휴수당 계산 결과를 함께 비교하면 근무 스케줄을 조정할 때 실제 수입 변화를 더 정확하게 예측할 수 있습니다.
        </p>
      </section>

      <section className="space-y-1 text-sm text-muted-foreground">
        <p>본 계산 결과는 간편 추정값입니다</p>
        <p>실제 급여는 근무형태 및 계약에 따라 달라질 수 있습니다</p>
      </section>

      <section className="rounded-lg border border-border/30 bg-card p-4 md:p-5">
        <p className="font-semibold mb-2">다른 계산기도 함께 확인해보세요</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/salary-calculator"
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            연봉 실수령 계산기
          </Link>
          <Link
            href="/calculators/income-tax"
            className="inline-flex h-10 items-center rounded-md border border-border/40 px-4 text-sm font-semibold hover:bg-muted"
          >
            종합소득세 계산기
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
