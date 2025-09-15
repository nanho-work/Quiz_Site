export const metadata = {
    title: "테스트 허브 | 구피",
    description: "재미있는 심리테스트 모음, 성격 유형 테스트와 다양한 퀴즈를 만나보세요.",
    openGraph: {
        title: "테스트 허브 | 구피",
        description: "무료 심리테스트와 MBTI 성격유형 테스트까지! 구피에서 만나보세요.",
        images: ["/egenteto.png"], // 퍼블릭에 배너 이미지 추가
    },
};

import TestCardSection from "../../components/card/CardSection";

export default function TestHub() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <section className="hero">
                <div className="text-center mb-12">
                    <h1
                        className="text-4xl md:text-5xl font-bold text-foreground mb-4"
                        data-testid="hero-title"
                    >
                        나는 어떤 사람일까? 🤔
                    </h1>
                    <p
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                        data-testid="hero-description"
                    >
                        재미있는 심리테스트로 나의 숨겨진 성격을 발견해보세요!
                    </p>
                </div>
            </section>
            <TestCardSection />
        </main>
    );
}
