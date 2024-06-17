import SearchBar from "@/components/Search";
import Header from "@/components/layouts/header";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="blue-ribbon"></div>

      <Header />

      <SearchBar />

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left"></div>
    </main>
  );
}
