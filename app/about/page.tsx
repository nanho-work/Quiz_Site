export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-tight">
        소개
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Koofy는 일상 속에서 재미있고 가볍게 즐길 수 있는 다양한 <strong>심리테스트</strong>,
          두뇌를 자극하는 <strong>게임</strong>, 그리고 흥미로운 <strong>정보 콘텐츠</strong>를
          제공하는 종합 플랫폼입니다. 단순한 오락을 넘어 자기 이해, 대화의 소재,
          그리고 집중력 향상을 위한 도구로 활용될 수 있도록 기획되었습니다.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          본 사이트는 광고나 유료 결제를 강요하지 않으며, 사용자의 개인정보를
          최소한으로 수집하고 안전하게 보호하는 것을 최우선으로 합니다.
          운영 유지 비용을 충당하기 위해 일부 광고(예: 구글 애드센스)가 사용될 수 있으나,
          서비스 경험을 해치지 않는 선에서 최소화합니다.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          앞으로 Koofy는 더 많은 심리테스트 유형을 추가하고, 스도쿠와 같은 두뇌 퍼즐 게임,
          그리고 생활 속 유익한 정보를 꾸준히 확장해 나갈 예정입니다. 이를 통해
          방문자분들께 <strong>재미</strong>, <strong>도움</strong>, <strong>휴식</strong>을
          함께 제공하는 플랫폼으로 자리매김하겠습니다.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          언제든 가볍게 찾아와 즐길 수 있는 공간, Koofy에 방문해 주셔서 감사합니다!
        </p>
      </div>
    </main>
  );
}