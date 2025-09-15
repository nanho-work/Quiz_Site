import { games } from "../../data/games";
import Link from "next/link";

export default function GamesPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">게임 허브 🎮</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          간단한 미니게임으로 킬링타임! 지금 바로 즐겨보세요.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className=" rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            <img src={game.image} alt={game.title} className="w-full object-cover" />
            <div className="p-4">
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <Link
                href={`/games/${game.id}`}
                className="text-primary font-semibold hover:underline"
              >
                시작하기 →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}