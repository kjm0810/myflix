'use client';

import { useLikedMovies } from '@/hooks/useLikedMovies';
import Detail from '@/popup/Detail';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'likedMovies';

export default function LikedPage() {
    const { isLiked, toggleLike } = useLikedMovies();
    const [movies, setMovies] = useState<movieItem[]>([]);
const [selectedMovie, setSelectedMovie] = useState<movieItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setMovies(JSON.parse(stored));
    }
  }, []);

  const openDetail = (movie: movieItem) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeDetail = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };
  return (
    <div className="frame like-movie-page">
      <div className="container">
        <h2 className="movieListTitle">좋아요한 영화</h2>

        {movies.length === 0 ? (
          <div className='empty-movie'>좋아요한 영화가 없습니다.</div>
        ) : (
          <div className="movieList">
            {movies.map((movie) => (
              <div key={movie.id} className="movieItem">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                  alt={movie.title}
                />
                <h3 className='movieTitle'>{movie.title}</h3>
                <div className="controller">
                    <div className="button play" onClick={() => alert("재생기능은 지원하지 않습니다.")}>
                        재생
                    </div>
                    <div className="button detail" onClick={() => openDetail(movie)}>
                        상세
                    </div>
                    
                    </div>

                    <div
                        className={`like-btn ${isLiked(movie.id) ? 'like' : ''}`}
                        onClick={(e) => {
                        e.stopPropagation(); // 상세 클릭 같은 이벤트랑 섞일 때 대비
                        toggleLike(movie);
                        }}
                        aria-pressed={isLiked(movie.id)}
                    >
                        ♥
                    </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {isModalOpen ? <Detail selectedMovie={selectedMovie} closeDetail={closeDetail} /> : null}
    </div>
  );
}
