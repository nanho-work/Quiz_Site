export default function AboutPage() {
  return (
    <section>
      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-tight">
        소개
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-gray-700 leading-relaxed">
          Koofy는 일상에서 자주 필요한 <strong>급여·세금 계산기</strong>를 쉽고 빠르게
          제공하는 서비스입니다. 복잡한 계산 과정을 단순화해, 누구나 입력 몇 번으로
          실무에 가까운 추정 결과를 확인할 수 있도록 기획되었습니다.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-gray-700 leading-relaxed">
          본 사이트는 광고나 유료 결제를 강요하지 않으며, 사용자의 개인정보를
          최소한으로 수집하고 안전하게 보호하는 것을 최우선으로 합니다.
          운영 유지 비용을 충당하기 위해 일부 광고(예: 구글 애드센스)가 사용될 수 있으나,
          서비스 경험을 해치지 않는 선에서 최소화합니다.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-gray-700 leading-relaxed">
          앞으로 Koofy는 더 다양한 계산기와 생활 밀착형 유틸리티를 꾸준히 확장해 나갈 예정입니다. 이를 통해
          방문자분들께 <strong>재미</strong>, <strong>도움</strong>, <strong>휴식</strong>을
          함께 제공하는 플랫폼으로 자리매김하겠습니다.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-700 leading-relaxed">
          언제든 가볍게 찾아와 즐길 수 있는 공간, Koofy에 방문해 주셔서 감사합니다!
        </p>
      </div>
    </section>
  );
}
