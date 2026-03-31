import type { Metadata } from "next";
import Link from "next/link";
import NetSalaryCalculatorClient from "../../components/calculators/NetSalaryCalculatorClient";

export const metadata: Metadata = {
  title: "연봉 실수령 계산기 (2026년 버전) | 세전·세후 월급 계산",
  description:
    "2026년 버전 기준 연봉 실수령액을 간편하게 계산해보세요. 세전 월급, 세후 월급, 4대보험 및 세금까지 한 번에 확인 가능합니다.",
  alternates: {
    canonical: "/salary-calculator",
  },
  openGraph: {
    title: "연봉 실수령 계산기 (2026년 버전) | 세전·세후 월급 계산",
    description:
      "2026년 버전 기준 연봉 실수령액을 간편하게 계산해보세요. 세전 월급, 세후 월급, 4대보험 및 세금까지 한 번에 확인 가능합니다.",
    url: "https://www.koofy.co.kr/salary-calculator",
    type: "website",
  },
  twitter: {
    title: "연봉 실수령 계산기 (2026년 버전) | 세전·세후 월급 계산",
    description:
      "2026년 버전 기준 연봉 실수령액을 간편하게 계산해보세요. 세전 월급, 세후 월급, 4대보험 및 세금까지 한 번에 확인 가능합니다.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "연봉 4000만원 실수령액은 얼마인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "연봉, 퇴직금 처리 방식, 부양가족 수, 비과세 금액에 따라 결과가 달라집니다. 이 페이지의 연봉 실수령 계산기에 연봉 4,000만원을 입력하면 2026년 기준으로 예상 월급 실수령액을 바로 확인할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "세후 월급은 어떻게 계산하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "세전 월급에서 국민연금, 건강보험, 장기요양보험, 고용보험, 소득세, 지방소득세를 차감해 세후 월급을 계산합니다. 이 계산기는 2026년 4대보험 계산 및 간이세액표 기준으로 월급 실수령액을 추정합니다.",
      },
    },
  ],
};

export default function SalaryCalculatorPage() {
  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">연봉 실수령 계산기 (2026년 버전)</h1>
        <p className="text-muted-foreground">
          연봉 또는 월급을 입력하면 세전 대비 세후 월급을 빠르게 확인할 수 있습니다.
        </p>
      </header>

      <NetSalaryCalculatorClient />

      <section className="space-y-4 text-sm text-muted-foreground">
        <h2 className="text-xl font-bold text-foreground">연봉 실수령 계산 방법</h2>
        <p>
          연봉 실수령 계산기는 세전 급여를 기준으로 월 단위 공제 항목을 순서대로 차감해 월급 실수령액을 보여주는 도구입니다.
          먼저 입력한 연봉을 월 급여로 환산하고, 퇴직금 포함 여부에 따라 12개월 또는 13개월 기준을 적용합니다. 이후 비과세 금액을 제외한 과세 대상
          급여를 기준으로 4대보험 계산을 진행하고, 부양가족 수와 20세 이하 자녀 수를 반영해 소득세와 지방소득세를 계산합니다. 이렇게 계산된 전체 공제
          금액을 세전 월급에서 차감하면 최종 세후 월급을 확인할 수 있습니다. 즉, 복잡한 계산 과정을 한 번에 압축해 보여주기 때문에 연봉 협상, 이직 검토,
          생활비 계획을 세울 때 빠르게 의사결정을 내리는 데 도움이 됩니다.
        </p>

        <h2 className="text-xl font-bold text-foreground">2026년 4대보험 및 세금 기준</h2>
        <p>
          이 페이지는 2026년 기준으로 국민연금, 건강보험, 장기요양보험, 고용보험 비율을 반영한 4대보험 계산 로직을 사용합니다.
          소득세는 단순 세율 곱셈이 아니라 근로소득 간이세액표 기반으로 산출하며, 지방소득세는 산출된 소득세의 10%를 적용합니다.
          월 과세급여가 일정 기준 이하인 구간에서는 소득세가 0원으로 계산될 수 있으며, 비과세 수당이나 부양가족 조건이 달라지면 결과도 함께 달라집니다.
          따라서 본 계산 결과는 신고용 확정값이라기보다 현실에 가까운 간편 추정치로 이해하는 것이 가장 정확합니다.
        </p>

        <h2 className="text-xl font-bold text-foreground">계산 결과 안내</h2>
        <p>
          계산 결과 영역에서는 국민연금, 건강보험, 장기요양보험, 고용보험, 소득세, 지방소득세를 항목별로 확인할 수 있고,
          세금 및 공제 합계와 최종 월급 실수령액이 함께 제공됩니다. 입력값을 바꾸면 결과가 즉시 반영되어 여러 시나리오를 비교하기 쉽고,
          모바일에서도 입력 UI를 한 화면에서 다루도록 구성해 빠르게 재계산할 수 있습니다. 더 정확한 절세 전략이 필요하다면 아래 링크로 이동해
          추가 세금 계산도 함께 확인해보세요.
        </p>
      </section>

      <section className="space-y-1 text-sm text-muted-foreground">
        <p>2026년 기준 간편 추정 결과입니다</p>
        <p>초기값은 1인 가구, 공제대상 가족 1명 기준입니다</p>
        <p>비과세 및 추가 공제에 따라 실제 금액은 달라질 수 있습니다</p>
      </section>

      <section className="rounded-lg border bg-card p-4 md:p-5">
        <p className="font-semibold mb-2">세금 더 줄이기</p>
        <p className="text-sm text-muted-foreground mb-3">
          종합소득세 계산기로 예상 세액을 함께 확인하고 절세 전략을 점검해보세요.
        </p>
        <Link
          href="/calculators/income-tax"
          className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          종합소득세 간편계산기 이동
        </Link>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
