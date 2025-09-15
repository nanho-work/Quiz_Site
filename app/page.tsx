import Hero from "../components/main/Hero";
import PopularGames from "../components/main/PopularGames";
import PopularTests from "../components/main/PopularTests";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Hero />
      <PopularGames />
      <PopularTests />
      <Footer />
    </main>
  );
}