import type { Metadata } from "next";
import Link from "next/link";
import ComprehensiveIncomeTaxCalculatorClient from "../../components/calculators/ComprehensiveIncomeTaxCalculatorClient";

export const metadata: Metadata = {
  title: "종합소득세 계산기 (2026) | 3.3% 프리랜서 세금 간편 계산",
  description:
    "종합소득세를 간편하게 계산해보세요. 3.3% 프리랜서, 사업자 세금, 환급 여부까지 5초 만에 확인 가능합니다.",
  alternates: {
    canonical: "/income-tax-calculator",
  },
  openGraph: {
    title: "종합소득세 계산기 (2026) | 3.3% 프리랜서 세금 간편 계산",
    description:
      "종합소득세를 간편하게 계산해보세요. 3.3% 프리랜서, 사업자 세금, 환급 여부까지 5초 만에 확인 가능합니다.",
    url: "https://www.koofy.co.kr/income-tax-calculator",
    type: "website",
  },
  twitter: {
    title: "종합소득세 계산기 (2026) | 3.3% 프리랜서 세금 간편 계산",
    description:
      "종합소득세를 간편하게 계산해보세요. 3.3% 프리랜서, 사업자 세금, 환급 여부까지 5초 만에 확인 가능합니다.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "종합소득세는 누구나 내야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "종합소득세는 이자·배당·사업·근로·연금·기타소득 등 종합소득이 있는 경우 신고 대상이 될 수 있습니다. 프리랜서와 개인사업자는 특히 종소세 신고 여부를 미리 확인하는 것이 중요합니다.",
      },
    },
    {
      "@type": "Question",
      name: "3.3% 세금은 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "3.3% 세금은 프리랜서 등에게 원천징수되는 세액을 의미하며, 실제 종합소득세 확정세액과는 차이가 있을 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "종합소득세 환급 받을 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "기납부세액(원천징수세액)이 최종 산출세액보다 크면 종합소득세 환급이 발생할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "종합소득세 신고 기간은 언제인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "일반적인 종합소득세 확정신고는 다음 해 5월, 성실신고확인대상사업자는 6월 말까지 진행합니다.",
      },
    },
  ],
};

export default function IncomeTaxCalculator2026Page() {
  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">종합소득세 계산기</h1>
        <p className="text-muted-foreground">
          2026년 5월 신고 시즌 기준 간편 추정용 계산기입니다. 총수입 기준으로 빠르게 예상 납부세액 또는 종합소득세 환급 가능성을 확인하세요.
        </p>
        <p className="text-xs text-amber-700 mt-2">
          직업군 카드의 경비율은 간편 추정치이며, 실제 단순경비율은 국세청 업종코드·귀속연도 기준과 다를 수 있습니다.
        </p>
      </header>

      <ComprehensiveIncomeTaxCalculatorClient />

      <section className="panel-card p-4 md:p-5">
        <p className="font-semibold mb-2">자료만 업로드하면 신고 완료</p>
        <p className="text-sm text-muted-foreground mb-3">
          계산기로 대략 확인했다면, 실제 신고는 전문가 검토로 정확도를 높이세요.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90">
            전문가에게 맡기기
          </Link>
          <Link href="/contact" className="inline-flex h-10 items-center rounded-md border border-border/40 px-4 text-sm font-semibold hover:bg-muted">
            5분 만에 종소세 해결
          </Link>
        </div>
      </section>

      <section className="space-y-4 text-sm text-muted-foreground">
        <h2 className="text-xl font-bold text-foreground">종합소득세란 무엇인가</h2>
        <p>
          종합소득세 계산기는 사업·프리랜서·기타소득처럼 여러 소득이 있는 사용자가 예상 세액을 빠르게 확인하는 도구입니다.
          특히 프리랜서 세금을 관리할 때는 3.3% 세금으로 원천징수된 금액만으로 판단하면 실제 결과와 차이가 생길 수 있어,
          종소세 신고 전에 총수입·경비·공제를 함께 확인해야 합니다. 이 계산기는 신고 확정용이 아니라 간편 추정용으로,
          납부 예상과 종합소득세 환급 가능성을 빠르게 파악하도록 설계했습니다.
        </p>

        <h2 className="text-xl font-bold text-foreground">3.3% 프리랜서 세금 계산 방법</h2>
        <p>
          3.3% 세금은 프리랜서 세금에서 자주 보이는 원천징수 비율입니다. 다만 3.3% 세금이 최종세액은 아니므로,
          종합소득세 계산기로 다시 계산해 종합소득세 환급 또는 추가 납부 여부를 확인해야 합니다. 계산 흐름은
          총수입 → 필요경비 → 종합소득금액 → 소득공제 → 과세표준 → 세율 적용 순서이며, 마지막에 기납부세액을 차감합니다.
        </p>

        <h2 className="text-xl font-bold text-foreground">종합소득세 계산 기준 (2026)</h2>
        <p>
          2026년 간편 추정 기준에서는 본인 1명 기본공제 1,500,000원을 사용합니다. 이 값은 실제 법적 공제 전체를 반영한 값이 아니며,
          종합소득세 계산기 MVP 기준 단순화 가정입니다. 지방소득세는 예상 종합소득세(국세)의 10%로 계산합니다. 일반적인 종합소득세
          확정신고는 다음 해 5월, 성실신고확인대상사업자는 6월 말까지 진행합니다.
        </p>

        <h2 className="text-xl font-bold text-foreground">예상 세금 계산 결과 안내</h2>
        <p>
          결과 화면에서는 총수입, 필요경비, 소득공제, 과세표준, 예상 국세, 예상 지방소득세, 기납부세액을 확인할 수 있습니다.
          이후 최종 납부예상세액 또는 종합소득세 환급 금액을 크게 보여주어 의사결정을 빠르게 돕습니다. 입력값 `annualIncome`은
          단순화된 총수입 기준이므로 실제 종소세 신고 구조와 차이가 날 수 있습니다.
        </p>

        <h2 className="text-xl font-bold text-foreground">절세 방법 및 신고 안내</h2>
        <p>
          프리랜서 세금 부담을 줄이려면 경비 증빙, 공제 항목, 다른 소득 합산 여부를 함께 점검해야 합니다.
          종합소득세 계산기는 빠른 1차 판단용이며, 최종 신고 전에는 홈택스 자료와 증빙 확인이 필요합니다.
          종소세 신고를 미리 준비하면 가산세 리스크를 줄이고 종합소득세 환급 기회도 챙길 수 있습니다.
        </p>
      </section>

      <section className="space-y-1 text-sm text-muted-foreground">
        <p>본 계산 결과는 간편 추정값입니다.</p>
        <p>실제 신고세액은 공제, 감면, 다른 소득 합산 여부에 따라 달라질 수 있습니다.</p>
        <p>정확한 신고는 홈택스 자료 및 증빙 검토 후 진행해야 합니다.</p>
        <p>연간 총수입(annualIncome) 기준 단순 모델로 실제 신고 구조와 차이가 있을 수 있습니다.</p>
      </section>

      <section className="panel-card p-4 md:p-5">
        <p className="font-semibold mb-2">다른 계산기도 함께 사용하세요</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/salary-calculator" className="inline-flex h-10 items-center rounded-md border border-border/40 px-4 text-sm font-semibold hover:bg-muted">
            연봉 실수령 계산기
          </Link>
          <Link href="/tax-refund-calculator" className="inline-flex h-10 items-center rounded-md border border-border/40 px-4 text-sm font-semibold hover:bg-muted">
            3.3% 환급 계산기
          </Link>
          <Link href="/minimum-wage-calculator" className="inline-flex h-10 items-center rounded-md border border-border/40 px-4 text-sm font-semibold hover:bg-muted">
            최저임금 계산기
          </Link>
        </div>
      </section>

      <section className="panel-card p-4 md:p-5">
        <p className="font-semibold mb-2">자료만 업로드하면 신고 완료</p>
        <p className="text-sm text-muted-foreground mb-3">
          계산 결과가 애매하면 전문가에게 맡기고 5분 만에 종소세 해결까지 진행해보세요.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90">
            전문가에게 맡기기
          </Link>
          <Link href="/contact" className="inline-flex h-10 items-center rounded-md border border-border/40 px-4 text-sm font-semibold hover:bg-muted">
            5분 만에 종소세 해결
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </section>
  );
}
