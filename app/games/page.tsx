import { games } from "../../data/games";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/card/card";
import Link from "next/link";

export default function GamesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">게임 허브 🎮</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          간단한 미니게임으로 킬링타임! 지금 바로 즐겨보세요.
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game) => (
          <Card key={game.id} className="card-hover shadow-lg h-[28rem] flex flex-col">
            <div
              className={`h-72 mt-3 rounded-t-lg flex items-center justify-center bg-contain bg-no-repeat bg-center ${!game.image ? `bg-gradient-to-br ${game.gradient}` : ""}`}
              style={game.image ? { backgroundImage: `url(${game.image})` } : {}}
            >
              <i className={`${game.icon} text-4xl text-white`}></i>
            </div>
            <CardHeader>
              <CardTitle>{game.title}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <CardContent />
            <CardFooter className="mt-auto ">
              <Link
                href={`/games/${game.id}`}
                className="text-primary font-semibold hover:underline"
              >
                시작하기 →
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}