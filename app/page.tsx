import { tests } from "../data/tests";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/card/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="hero-title">
            나는 어떤 사람일까? 🤔
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="hero-description">
            재미있는 심리테스트로 나의 숨겨진 성격을 발견해보세요!
          </p>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tests.map((test) => (
          <Card key={test.id} className="card-hover shadow-lg">
            <div className={`h-48 rounded-t-lg bg-gradient-to-br ${test.gradient} flex items-center justify-center`}>
              <div className="text-center">
                <i className={`${test.icon} text-4xl text-white mb-3`}></i>
                <h3 className="text-white font-bold text-lg">{test.title.split(' ')[0]}</h3>
              </div>
            </div>
            <CardHeader>
              <CardTitle>{test.title}</CardTitle>
              <CardDescription>{test.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Removed duration text from here */}
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-muted-foreground">소요 시간: {test.duration}</p>
                <Link
                  href={`/test/${test.id}`}
                  className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  테스트 시작
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}