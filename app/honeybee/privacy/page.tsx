import type { Metadata } from "next";

import PrivacyPolicyNav from "../../../components/legal/PrivacyPolicyNav";

export const metadata: Metadata = {
  title: "허니비(Honeybee) 개인정보 처리방침 | Koofy Lab",
  description: "Koofy Lab의 모바일 게임 허니비(Honeybee) 개인정보 처리방침입니다.",
  alternates: {
    canonical: "/honeybee/privacy",
  },
};

const googlePrivacyLinks = [
  {
    label: "Google 개인정보처리방침",
    href: "https://policies.google.com/privacy",
  },
  {
    label: "Google 제휴 서비스의 정보 이용 안내",
    href: "https://policies.google.com/technologies/partner-sites",
  },
  {
    label: "Firebase 개인정보 보호 및 보안 안내",
    href: "https://firebase.google.com/support/privacy",
  },
];

export default function HoneybeePrivacyPage() {
  return (
    <article className="mx-auto max-w-4xl">
      <PrivacyPolicyNav active="honeybee" />

      <header className="mb-10">
        <p className="mb-2 text-sm font-semibold text-primary">Honeybee</p>
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">
          허니비(Honeybee) 개인정보 처리방침
        </h1>
        <dl className="mt-4 grid gap-1 text-sm text-muted-foreground">
          <div className="flex gap-2">
            <dt className="font-semibold text-foreground">시행일</dt>
            <dd>2026년 7월 28일</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold text-foreground">최종 수정일</dt>
            <dd>2026년 7월 28일</dd>
          </div>
        </dl>
      </header>

      <div className="mb-10 rounded-lg border border-border bg-card p-5 leading-relaxed text-muted-foreground">
        <p>
          Koofy Lab(이하 &ldquo;운영자&rdquo;)은 모바일 게임
          <strong className="font-semibold text-foreground"> 허니비(Honeybee)</strong>
          (이하 &ldquo;서비스&rdquo;) 이용자의 개인정보를 중요하게 생각하며,
          관련 법령에 따라 개인정보를 안전하게 처리하기 위해 다음과 같이
          개인정보 처리방침을 공개합니다.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5">
          <li>서비스명: 허니비(Honeybee)</li>
          <li>
            Android 패키지명: <code>com.koofy.mergemanor</code>
          </li>
          <li>운영자: Koofy Lab</li>
        </ul>
      </div>

      <div className="space-y-9 leading-relaxed text-muted-foreground">
        <PolicySection title="1. 기기 내 저장 정보 및 자동으로 처리되는 정보">
          <h3 className="mt-4 font-semibold text-foreground">
            1.1 기기 내에 저장되는 게임 정보
          </h3>
          <p className="mt-2">
            서비스는 회원가입이나 계정 기능을 제공하지 않으며, 이용자에게 이름,
            생년월일, 전화번호, 주소, 사진, 마이크 또는 정밀 위치정보를 직접
            입력하도록 요구하지 않습니다.
          </p>
          <p className="mt-2">
            다음 정보는 게임 진행과 설정 유지를 위해 이용자의 기기에 저장될 수
            있습니다. 운영자는 이 정보를 별도의 계정 서버나 클라우드 저장
            기능을 통해 직접 수집하지 않습니다.
          </p>
          <BulletList
            items={[
              "플레이어 레벨, 경험치 및 게임 재화",
              "머지 보드, 창고, 아이템 및 제너레이터 상태",
              "주문, 퀘스트 및 이벤트 진행 정보",
              "보상 수령 및 광고 이용 횟수",
              "상점 구매 상태, 앱 설정, 저장 시각 및 접속 시각",
            ]}
          />
          <p className="mt-2">
            기기 운영체제의 백업 설정에 따라 일부 정보가 플랫폼 사업자의 백업
            서비스에 포함될 수 있으며, 해당 처리는 각 플랫폼 사업자의 정책을
            따릅니다.
          </p>

          <h3 className="mt-5 font-semibold text-foreground">
            1.2 외부 SDK를 통해 자동으로 처리될 수 있는 정보
          </h3>
          <p className="mt-2">
            Google Mobile Ads, User Messaging Platform 및 Firebase 서비스를
            이용하는 과정에서 다음 정보가 자동으로 처리될 수 있습니다.
          </p>
          <BulletList
            items={[
              "IP 주소 및 IP 주소로 추정한 대략적인 지역",
              "광고 ID, Firebase 설치 식별자 등 기기 또는 앱 식별자",
              "기기 모델, 운영체제, 언어, 국가 및 앱 버전",
              "앱 실행, 화면 이용 및 게임 기능 이용 기록",
              "광고 노출, 광고 시청, 보상 지급 및 광고 상호작용 기록",
              "네트워크 상태, 요청 결과 및 오류 등 진단 정보",
              "개인정보 및 광고 동의 상태",
            ]}
          />
          <p className="mt-2">
            운영자는 이러한 정보를 이용자의 이름이나 연락처와 직접 연결하여
            수집하지 않습니다.
          </p>

          <h3 className="mt-5 font-semibold text-foreground">
            1.3 문의 과정에서 제공되는 정보
          </h3>
          <p className="mt-2">
            이용자가 이메일로 문의하는 경우 이메일 주소, 문의 내용, 직접 첨부한
            이미지 또는 파일, 문제 확인에 필요한 기기·앱 버전 정보가 처리될 수
            있습니다.
          </p>
        </PolicySection>

        <PolicySection title="2. 정보의 이용 목적">
          <BulletList
            items={[
              "게임 진행 상태 저장 및 복구",
              "주문, 퀘스트, 이벤트 및 보상 기능 제공",
              "보상형 광고 제공, 광고 보상 확인 및 중복 보상 방지",
              "서비스 이용 현황 분석 및 게임 개선",
              "앱 설정과 콘텐츠 구성 제공",
              "오류 확인, 보안 유지 및 부정 이용 방지",
              "이용자 문의와 불편 사항 처리",
              "관련 법령과 서비스 정책 준수",
            ]}
          />
        </PolicySection>

        <PolicySection title="3. 보상형 광고">
          <p>
            서비스는 이용자가 광고 보상 버튼을 직접 선택한 경우에만 보상형
            광고를 요청합니다. 광고 시청이 완료되고 광고 제공업체로부터 정상적인
            완료 결과가 전달되면 안내된 게임 내 보상이 지급됩니다.
          </p>
          <p className="mt-2">
            광고 맞춤설정을 거부하더라도 게임의 기본 기능은 이용할 수 있습니다.
            다만 동의 상태, 네트워크 환경 또는 광고 재고 부족 등에 따라 광고
            시청을 통한 선택적 보상 기능이 제한될 수 있습니다.
          </p>
        </PolicySection>

        <PolicySection title="4. 외부 서비스 및 개인정보 처리업무의 위탁">
          <p>
            운영자는 광고 제공, 동의 관리, 이용 분석, 원격 설정 및 정책 페이지
            제공을 위해 Google LLC 및 관련 Google 계열사의 다음 서비스를
            이용할 수 있습니다.
          </p>
          <BulletList
            items={[
              "Google AdMob 및 Google Mobile Ads SDK",
              "User Messaging Platform(UMP)",
              "Firebase Analytics",
              "Firebase Remote Config",
              "Firebase Hosting",
            ]}
          />
          <p className="mt-2">
            Google은 광고 제공·측정, 광고 보상 확인, 동의 관리, 이용 현황 분석,
            원격 설정, 보안 및 부정 이용 방지를 위해 제1조에 기재된 기술 정보를
            처리할 수 있습니다. Google 이외의 광고 미디에이션 업체나 광고
            네트워크를 추가로 이용하게 되는 경우 해당 내용을 본 방침에
            반영합니다.
          </p>
          <ul className="mt-3 space-y-1">
            {googlePrivacyLinks.map((link) => (
              <li key={link.href}>
                <a
                  className="underline underline-offset-4 hover:text-foreground"
                  href={link.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </PolicySection>

        <PolicySection title="5. 개인정보의 국외 처리 및 이전">
          <p>
            외부 서비스 이용 과정에서 서비스 제공에 필요한 정보가 국외에서
            처리되거나 이전될 수 있습니다.
          </p>
          <DefinitionList
            items={[
              ["이전받는 자", "Google LLC 및 Google의 관련 처리업체"],
              [
                "이전 국가",
                "미국을 포함하여 Google 또는 그 처리업체가 시설을 운영하는 국가",
              ],
              [
                "이전 항목",
                "IP 주소, 광고 ID, 앱·기기 식별자, 기기·앱 정보, 대략적인 지역, 앱 이용·광고 상호작용 기록, 진단 정보 및 동의 상태",
              ],
              [
                "이전 목적",
                "광고 제공·측정, 이용 분석, 동의 관리, 원격 설정, 보안 및 부정 이용 방지",
              ],
              [
                "시점 및 방법",
                "앱 실행, 설정 조회, 분석 이벤트 전송 또는 광고 요청 시 암호화된 네트워크를 통해 전송",
              ],
              [
                "보유기간",
                "각 서비스 설정, 계약 조건, 관계 법령 및 Google 개인정보처리방침에서 정한 기간",
              ],
              [
                "이전 근거",
                "서비스 제공에 필요한 처리위탁·보관 또는 이용자의 동의 등 관계 법령에서 인정하는 근거",
              ],
            ]}
          />
          <p className="mt-3">
            이용자는 앱의 개인정보·광고 설정 또는 Android의 광고 개인정보
            설정을 통해 선택을 변경하거나 앱을 삭제할 수 있습니다. 국외 처리를
            거부하면 기본 게임 기능은 이용할 수 있으나 광고 기반 보상이나 일부
            온라인 설정 기능이 제한될 수 있습니다.
          </p>
        </PolicySection>

        <PolicySection title="6. 정보의 보유기간 및 파기">
          <BulletList
            items={[
              "기기 내 게임 정보: 이용자가 앱 데이터 삭제, 게임 초기화 또는 앱 삭제를 할 때까지",
              "문의 정보: 문의 처리에 필요한 기간 동안 보관한 후 지체 없이 삭제. 관계 법령상 보관 의무가 있는 경우에는 해당 기간 동안 보관",
              "Firebase 및 광고 관련 정보: 운영자가 설정한 보유기간과 Google의 서비스 정책에 따라 보관",
            ]}
          />
          <p className="mt-2">
            보유기간이 지나거나 처리 목적이 달성된 개인정보는 지체 없이
            파기합니다. 전자적 파일은 복구 또는 재생하기 어렵도록 안전한
            방법으로 삭제하고, 종이 문서가 있는 경우 분쇄하거나 소각합니다.
            Google이 직접 관리하는 정보는 Google의 보유 및 삭제 정책에 따라
            처리됩니다.
          </p>
        </PolicySection>

        <PolicySection title="7. 이용자의 선택과 권리">
          <BulletList
            items={[
              "기기 설정에서 앱 저장공간을 삭제하여 로컬 게임 데이터 초기화",
              "앱 삭제를 통한 로컬 게임 데이터 삭제",
              "앱에서 제공하는 개인정보·광고 설정을 통한 동의 상태 변경",
              "Android 기기 설정을 통한 광고 ID 재설정 또는 삭제",
              "운영자에게 개인정보 열람, 정정, 삭제, 처리정지 또는 동의 철회 요청",
            ]}
          />
          <p className="mt-2">
            앱 식별자처럼 이용자를 직접 식별하지 않는 정보는 특정 이용자의
            정보인지 확인하기 어려워 개별 조회 또는 삭제가 제한될 수 있습니다.
            권리 행사는 아래 개인정보 보호 문의처를 통해 요청할 수 있습니다.
          </p>
        </PolicySection>

        <PolicySection title="8. 아동의 개인정보">
          <p>
            서비스는 일반 이용자를 대상으로 하며, 법정대리인의 동의 없이 만
            14세 미만 아동의 이름, 이메일 주소 등 직접 식별할 수 있는 개인정보를
            의도적으로 수집하지 않습니다.
          </p>
          <p className="mt-2">
            만 14세 미만 아동의 개인정보가 법정대리인의 동의 없이 수집된 사실을
            확인한 경우 운영자는 해당 정보를 지체 없이 삭제하기 위해
            노력합니다. 향후 아동을 주요 대상으로 하거나 아동의 개인정보를 직접
            수집하는 기능이 추가되면 법정대리인 동의 절차와 아동에게 적합한 광고
            설정을 적용하고 본 방침을 개정합니다.
          </p>
        </PolicySection>

        <PolicySection title="9. 개인정보의 안전성 확보 조치">
          <BulletList
            items={[
              "서비스 제공에 필요한 최소한의 정보 처리",
              "외부 서비스와 통신할 때 암호화된 연결 사용",
              "개발 및 운영 접근 권한 제한",
              "광고 보상의 중복 지급 및 부정 이용 방지",
              "저장 정보와 외부 SDK의 처리 범위 정기 점검",
              "개인정보 관련 문제 발생 시 신속한 대응과 삭제",
            ]}
          />
        </PolicySection>

        <PolicySection title="10. 개인정보 처리방침의 변경">
          <p>
            서비스 기능, 이용하는 외부 서비스 또는 관련 법령이 변경되면 본
            개인정보 처리방침도 변경될 수 있습니다. 중요한 변경 사항은 시행일
            최소 7일 전에 앱, 공식 페이지 또는 기타 적절한 방법으로 안내하며,
            이용자의 권리에 중대한 영향을 미치는 변경은 가능한 경우 시행일 최소
            30일 전에 안내합니다.
          </p>
        </PolicySection>

        <PolicySection title="11. 개인정보 보호 문의처">
          <DefinitionList
            items={[
              ["운영자", "Koofy Lab"],
              ["개인정보 보호 담당자", "Koofy Lab 개인정보 보호 담당자"],
              ["문의 이메일", "koofylab@gmail.com"],
              ["국가", "대한민국"],
            ]}
          />
          <p className="mt-3">
            개인정보 처리와 관련된 문의, 불만 또는 권리 행사는{" "}
            <a
              className="underline underline-offset-4 hover:text-foreground"
              href="mailto:koofylab@gmail.com"
            >
              koofylab@gmail.com
            </a>
            으로 요청할 수 있으며, 운영자는 합리적인 기간 안에 답변하겠습니다.
          </p>
        </PolicySection>

        <PolicySection title="12. 권익침해 구제기관">
          <BulletList
            items={[
              "개인정보침해 신고센터: 국번 없이 118 (privacy.kisa.or.kr)",
              "개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)",
              "개인정보 포털: www.privacy.go.kr",
            ]}
          />
          <p className="mt-4 font-medium text-foreground">
            본 개인정보 처리방침은 2026년 7월 28일부터 적용됩니다.
          </p>
        </PolicySection>
      </div>
    </article>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function DefinitionList({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="mt-3 overflow-hidden rounded-lg border border-border">
      {items.map(([term, description]) => (
        <div
          className="grid gap-1 border-b border-border p-3 last:border-b-0 sm:grid-cols-[9rem_1fr]"
          key={term}
        >
          <dt className="font-semibold text-foreground">{term}</dt>
          <dd>{description}</dd>
        </div>
      ))}
    </dl>
  );
}
