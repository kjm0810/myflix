import MovieList from "@/components/MovieList";

export default function Home() {
  return (
    <div className="frame">
      <MovieList isRandomMovie={true}></MovieList>
    </div>
  );
}
