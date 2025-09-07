// app/privacy/page.tsx
export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">개인정보 처리방침</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">
        최종 업데이트: 2025-09-07
      </p>

      <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. 총칙</h2>
          <p>
            koofy.co.kr(이하 “사이트”)는 이용자의 개인정보를 중요시하며 「개인정보 보호법」 등 관련 법령을 준수합니다.
            본 개인정보 처리방침은 사이트가 제공하는 서비스 이용과 관련하여 수집·이용되는 개인정보의 항목, 목적,
            보관 및 보호 조치에 대해 설명합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. 수집하는 개인정보 항목</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><b>필수:</b> 서비스 이용 기록(페이지 방문, 클릭, 테스트 응답 결과의 집계값 등 비식별 정보)</li>
            <li><b>선택:</b> 문의 시 제공되는 이메일, 이름 등 사용자가 직접 입력한 정보</li>
            <li><b>자동 수집:</b> 쿠키(Cookie), 접속 IP, 브라우저/기기 정보, 접속 일시, 리퍼러 등</li>
          </ul>
          <p className="mt-2 text-sm opacity-80">
            * 테스트 문항의 개별 응답은 개인 식별이 불가능한 형태로 처리·집계될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. 개인정보의 처리 목적</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>서비스 제공 및 운영(심리 테스트 진행, 결과 화면 제공)</li>
            <li>이용 통계·분석을 통한 서비스 개선</li>
            <li>부정 이용 방지 및 보안</li>
            <li>고객 문의 응대(연락처를 제공한 경우에 한함)</li>
            <li>맞춤형 광고 제공(쿠키/광고 식별자 활용)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. 쿠키(Cookie) 및 유사 기술</h2>
          <p>
            사이트는 이용자 편의 및 서비스 개선, 맞춤형 광고 제공을 위해 쿠키를 사용할 수 있습니다. 
            이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있으나, 일부 기능 이용에 제한이 있을 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. 온라인 광고(AdSense 등)</h2>
          <p>
            사이트는 Google AdSense 등 제3자 광고 네트워크의 광고를 게재할 수 있으며, 이 과정에서 제3자는 
            쿠키 또는 유사 기술을 사용하여 이용자의 이전 방문 정보를 바탕으로 맞춤형 광고를 제공할 수 있습니다.
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Google 및 파트너는 쿠키를 사용하여 광고를 게재하고 성과를 측정할 수 있습니다.</li>
            <li>이용자는 광고 설정에서 맞춤형 광고를 비활성화할 수 있습니다.</li>
          </ul>
          <p className="text-sm opacity-80 mt-2">
            * 광고 노출과 관련된 보다 자세한 내용은 Google의 광고 정책 및 이용자 선택 가이드를 참고하세요.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. 개인정보 보유 및 이용 기간</h2>
          <p>
            법령에 특별한 규정이 없는 한, 개인정보는 수집·이용 목적 달성 시 지체 없이 파기합니다.
            단, 서비스 운영 기록 등은 서비스 개선 및 보안, 분쟁 대비를 위해 합리적인 기간 동안 보관될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">7. 제3자 제공 및 처리위탁</h2>
          <p>
            사이트는 이용자의 동의가 있거나 법령에 근거가 있는 경우를 제외하고 개인정보를 제3자에게 제공하지 않습니다.
            서비스 품질 향상을 위해 필요한 경우, 개인정보 처리 업무의 일부를 위탁할 수 있으며,
            위탁 시 수탁자, 위탁 범위 및 보호 조치를 고지합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">8. 이용자의 권리</h2>
          <p>
            이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리 정지 등을 요청할 수 있습니다.
            단, 법령에 따라 보관이 요구되는 정보는 삭제가 제한될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">9. 아동의 개인정보</h2>
          <p>
            사이트는 원칙적으로 만 14세 미만 아동으로부터 개인정보를 수집하지 않습니다.
            아동의 개인정보가 수집된 사실을 인지하는 경우, 지체 없이 해당 정보를 삭제합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">10. 안전성 확보 조치</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>전송 구간 암호화(HTTPS)</li>
            <li>접근 통제 및 최소 권한 부여</li>
            <li>로그 모니터링 및 이상 징후 대응</li>
            <li>필요 시 비식별화·가명처리</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">11. 제3자 사이트로의 링크</h2>
          <p>
            사이트에는 외부 사이트로 연결되는 링크가 포함될 수 있습니다. 외부 사이트의 개인정보 처리에 대해서는
            해당 사이트의 정책이 적용되며, 사이트는 그에 대한 책임을 지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">12. 개인정보 보호책임자 및 문의처</h2>
          <p className="mb-2">
            개인정보 보호와 관련된 문의는 아래로 연락해 주세요. 합리적인 기간 내에 성실히 답변드리겠습니다.
          </p>
          <ul className="list-disc list-inside">
            <li>담당자: 개인정보 보호책임자</li>
            <li>이메일: <a className="underline" href="mailto:contact@koofy.co.kr">contact@koofy.co.kr</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">13. 정책의 변경</h2>
          <p>
            본 개인정보 처리방침은 법령, 서비스 변경에 따라 개정될 수 있으며, 개정 시 본 페이지에 공지합니다.
            중요한 변경이 있을 경우, 합리적인 수단으로 별도 고지할 수 있습니다.
          </p>
        </section>

        <section className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm">
            관련 문서: <a href="/terms" className="underline">서비스 이용약관</a>
          </p>
        </section>
      </div>
    </main>
  );
}