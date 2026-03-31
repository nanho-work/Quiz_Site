export default function ContactPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">문의하기</h1>
      <p className="text-muted-foreground leading-relaxed">
        서비스와 관련하여 문의 사항이나 제안 사항이 있으시면 아래 연락처로 알려주세요. 
        <br/>가능한 한 빠르게 확인하고 답변드리겠습니다.
      </p>

      <div className="panel-card">
        <h2 className="text-xl font-semibold mb-2">연락처</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>
            📧 이메일:{" "}
            <a
              href="mailto:webmaster@koofy.co.kr"
              className="underline decoration-border underline-offset-4 hover:text-primary"
            >
              webmaster@koofy.co.kr
            </a>
          </li>
        </ul>
      </div>

      <p className="text-muted-foreground leading-relaxed">
        사용자의 의견은 서비스 개선에 큰 도움이 됩니다. 
        <br/>소중한 의견과 피드백을 기다리고 있습니다.
      </p>
    </section>
  );
}
