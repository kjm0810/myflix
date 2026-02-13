type apiOption = {
    url?: string,
    language?: string,
    page?: number
}

type genre = {
    id: number,
    name: string 
};

type movieItem = {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string; // YYYY-MM-DD
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

type genre = {
    id: number,
    name: string
}