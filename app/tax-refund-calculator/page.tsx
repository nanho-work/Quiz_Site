import type { Metadata } from "next";
import Link from "next/link";
import Refund33CalculatorClient from "../../components/calculators/Refund33CalculatorClient";

export const metadata: Metadata = {
  title: "3.3% 환급 계산기 | 프리랜서 세금 환급 금액 확인 (2026)",
  description:
    "프리랜서 3.3% 세금 환급 금액을 간편하게 계산해보세요. 이미 낸 세금과 실제 세금을 비교해 환급 또는 추가 납부 금액을 바로 확인할 수 있습니다.",
  alternates: {
    canonical: "/tax-refund-calculator",
  },
  openGraph: {
    title: "3.3% 환급 계산기 | 프리랜서 세금 환급 금액 확인 (2026)",
    description:
      "프리랜서 3.3% 세금 환급 금액을 간편하게 계산해보세요. 이미 낸 세금과 실제 세금을 비교해 환급 또는 추가 납부 금액을 바로 확인할 수 있습니다.",
    url: "https://www.koofy.co.kr/tax-refund-calculator",
    type: "website",
  },
  twitter: {
    title: "3.3% 환급 계산기 | 프리랜서 세금 환급 금액 확인 (2026)",
    description:
      "프리랜서 3.3% 세금 환급 금액을 간편하게 계산해보세요. 이미 낸 세금과 실제 세금을 비교해 환급 또는 추가 납부 금액을 바로 확인할 수 있습니다.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "3.3% 세금은 왜 떼는 건가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "3.3% 세금은 사업소득세 3%와 지방소득세 0.3%를 미리 원천징수하는 방식입니다. 최종 확정세액은 종합소득세 신고 때 다시 계산됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "프리랜서는 환급을 받을 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "가능합니다. 이미 낸 원천징수세액이 최종 산출세액보다 크면 종합소득세 환급이 발생할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "3.3% 환급은 언제 받나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "보통 종합소득세 신고 후 환급 심사를 거쳐 지급됩니다. 접수 시기와 처리 상태에 따라 일정은 달라질 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "종합소득세 신고는 꼭 해야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "프리랜서 등 사업소득이 있다면 신고 대상이 될 수 있습니다. 신고를 해야 환급 여부를 확정할 수 있습니다.",
      },
    },
  ],
};

export default function TaxRefundCalculatorPage() {
  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">3.3% 환급 계산기</h1>
        <p className="text-muted-foreground">
          3.3 환급 가능성을 빠르게 확인하는 간편 계산기입니다. 이미 낸 3.3% 세금과 예상 종합소득세를 비교해 환급 또는 추가 납부 금액을 확인하세요.
        </p>
      </header>

      <Refund33CalculatorClient />

      <section className="panel-card p-4 md:p-5">
        <p className="font-semibold mb-2">자료만 올리면 신고 완료</p>
        <p className="text-sm text-muted-foreground mb-3">
          환급 계산기 결과를 확인했다면, 신고 단계는 전문가 검토로 정확도를 높일 수 있습니다.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90">
            전문가에게 맡기기
          </Link>
          <Link href="/contact" className="inline-flex h-10 items-center rounded-md border border-border/40 px-4 text-sm font-semibold hover:bg-muted">
            환급 금액 더 줄이기
          </Link>
        </div>
      </section>

      <section className="space-y-4 text-sm text-muted-foreground">
        <h2 className="text-xl font-bold text-foreground">3.3% 세금이란 무엇인가</h2>
        <p>
          3.3% 세금은 프리랜서 세금에서 가장 자주 만나는 원천징수 방식입니다. 지급 단계에서 사업소득세 3%와 지방소득세 0.3%를 먼저 떼기 때문에,
          지금 낸 금액이 곧 최종세액은 아닙니다. 그래서 3.3 환급 가능성은 종합소득세 신고 흐름으로 다시 계산해야 하며, 이 환급 계산기로 먼저 방향을 확인하는 것이 좋습니다.
        </p>

        <h2 className="text-xl font-bold text-foreground">프리랜서 환급이 발생하는 이유</h2>
        <p>
          프리랜서 세금은 총수입, 필요경비, 공제 반영 정도에 따라 최종세액이 크게 달라집니다. 이미 낸 3.3% 세금이 실제 산출세액보다 많으면 종합소득세 환급이 생기고,
          반대면 추가 납부가 발생합니다. 즉 3.3 환급 확인은 단순 비율 체크가 아니라, 신고 전에 세금 차이를 비교하는 과정이라고 볼 수 있습니다.
        </p>

        <h2 className="text-xl font-bold text-foreground">3.3% 환급 계산 방법</h2>
        <p>
          계산 순서는 총수입에서 필요경비를 차감해 종합소득금액을 구하고, 소득공제를 반영해 과세표준을 계산한 뒤 국세청 기본세율을 적용하는 구조입니다.
          여기에 지방소득세를 더하고, 이미 낸 3.3% 세금을 빼서 환급 또는 추가 납부를 판단합니다. 환급 계산기는 이 흐름을 단순화해 3.3 환급 판단에 필요한 핵심 값만 즉시 보여줍니다.
        </p>

        <h2 className="text-xl font-bold text-foreground">예상 환급액 확인하기</h2>
        <p>
          결과 화면의 핵심은 환급예상액 또는 추가 납부예상액입니다. 종합소득세 환급이 예상되면 신고 일정을 미루지 말고, 추가 납부가 보이면 경비·공제 증빙을 먼저 점검하세요.
          프리랜서 세금은 다른 소득 합산 여부에 따라 달라질 수 있으므로, 환급 계산기 결과를 1차 기준으로 활용하고 최종 신고는 홈택스 자료 확인 후 진행하는 것을 권장합니다.
        </p>
      </section>

      <section className="space-y-1 text-sm text-muted-foreground">
        <p>3.3%는 최종 세금이 아닌 원천징수 금액입니다.</p>
        <p>본 계산 결과는 간편 추정값입니다.</p>
        <p>실제 세액은 공제, 감면, 다른 소득 합산 여부에 따라 달라질 수 있습니다.</p>
      </section>

      <section className="panel-card p-4 md:p-5">
        <p className="font-semibold mb-2">다른 계산기도 함께 사용하세요</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/income-tax-calculator" className="inline-flex h-10 items-center rounded-md border border-border/40 px-4 text-sm font-semibold hover:bg-muted">
            종합소득세 계산기
          </Link>
          <Link href="/salary-calculator" className="inline-flex h-10 items-center rounded-md border border-border/40 px-4 text-sm font-semibold hover:bg-muted">
            연봉 실수령 계산기
          </Link>
          <Link href="/minimum-wage-calculator" className="inline-flex h-10 items-center rounded-md border border-border/40 px-4 text-sm font-semibold hover:bg-muted">
            최저임금 계산기
          </Link>
        </div>
      </section>

      <section className="panel-card p-4 md:p-5">
        <p className="font-semibold mb-2">자료만 올리면 신고 완료</p>
        <p className="text-sm text-muted-foreground mb-3">
          환급 규모를 확인했다면 이제 신고만 남았습니다. 전문가에게 맡기고 처리 시간을 줄여보세요.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90">
            전문가에게 맡기기
          </Link>
          <Link href="/contact" className="inline-flex h-10 items-center rounded-md border border-border/40 px-4 text-sm font-semibold hover:bg-muted">
            환급 금액 더 줄이기
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </section>
  );
}
