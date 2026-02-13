'use client'

import { useLikedMovies } from "@/hooks/useLikedMovies";
import Detail from "@/popup/Detail";
import { useEffect, useRef, useState } from "react";

export default function GenreItem({ genre }: { genre: genre }) {
  const [option] = useState<apiOption>({ url: "discover/movie" });
  const [movieList, setMovieList] = useState<movieItem[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<movieItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);

  const { isLiked, toggleLike } = useLikedMovies();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/tmdb/list?url=${option.url}&with_genres=${genre.id}&sort_by=popularity.desc&page=1`
        );
        const data = await res.json();
        setMovieList(data.results ?? []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [option.url, genre.id]);

  // 드래그 스크롤
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      // 링크/버튼 클릭 방해 줄이기 위해 왼쪽 버튼만
      if (e.button !== 0) return;

      isDown = true;
      el.classList.add("dragging");
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      el.classList.remove("dragging");
    };

    const onMouseUp = () => {
      isDown = false;
      el.classList.remove("dragging");
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5; // 드래그 속도(원하면 조절)
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
    };
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
    <div className="genre-item">
      <div className="title">{genre.name}</div>

      {/* 여기 ref만 달면 됩니다 */}
      <div className="movieList dragScroll" ref={listRef}>
        {movieList.map((movie, index) => (
          <div key={`genre-${genre.id}-${index}`} className="movieItem">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
              alt={movie.title}
              draggable={false}
            />
            <h3 className="movieTitle">{movie.title}</h3>

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

      {isModalOpen ? <Detail selectedMovie={selectedMovie} closeDetail={closeDetail} /> : null}
    </div>
  );
}
