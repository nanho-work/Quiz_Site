export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">문의하기</h1>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        서비스와 관련하여 문의 사항이나 제안 사항이 있으시면 아래 연락처로
        알려주세요. 가능한 한 빠르게 확인하고 답변드리겠습니다.
      </p>

      <div className="bg-muted p-6 rounded-md shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">연락처</h2>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            📧 이메일:{" "}
            <a
              href="mailto:contact@koofy.co.kr"
              className="underline hover:text-primary"
            >
              contact@koofy.co.kr
            </a>
          </li>
        </ul>
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        사용자의 의견은 서비스 개선에 큰 도움이 됩니다. 소중한 의견과 피드백을
        기다리고 있습니다.
      </p>
    </main>
  );
}