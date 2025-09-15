import React from "react";
import Link from "next/link";
import { games } from "../../data/games";

export default function PopularGames() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">인기 게임 🎮</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className=" rounded-lg shadow hover:shadow-lg transition overflow-hidden">
            <img src={game.image} alt={game.title} className="w-full object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg">{game.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{game.description}</p>
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