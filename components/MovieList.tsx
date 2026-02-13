'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useLikedMovies } from '@/hooks/useLikedMovies';
import Detail from '@/popup/Detail';

export default function MovieList({ isRandomMovie, isTitle = true, keyword = '' }: { isRandomMovie?: boolean, isTitle?: boolean, keyword?: string }) {
  const [option] = useState<apiOption>({ url:  keyword !== '' && keyword !== null ? 'search/movie' : 'movie/popular' });

  const url = `/api/tmdb/list?url=${option.url}${keyword !== '' && keyword !== null ? `&query=${encodeURIComponent(keyword)}` : ''}`;

  // UI 상태
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // 데이터 상태
  const [movies, setMovies] = useState<movieItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 랜덤 배너
  const [randomMovie, setRandomMovie] = useState<movieItem | null>(null);

  // 모달
  const [selectedMovie, setSelectedMovie] = useState<movieItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 좋아요
  const { isLiked, toggleLike } = useLikedMovies();

  // 무한 스크롤 sentinel
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const truncateOverview = (overview?: string) => {
    if (!overview) return '';
    const firstDotIndex = overview.indexOf('.');
    if (firstDotIndex !== -1) return overview.substring(0, firstDotIndex + 1);
    return overview;
  };

  const openDetail = (movie: movieItem) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeDetail = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  // 1) 첫 페이지 로딩
  useEffect(() => {
    const fetchFirst = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(url);
        const data = await res.json();

        const list: movieItem[] = data.results ?? [];
        setMovies(list);

        // 랜덤 배너는 backdrop 있는 것 중에서 뽑는 게 안전
        const candidates = list.filter((m) => m?.backdrop_path);
        const rm =
          candidates.length > 0
            ? candidates[Math.floor(Math.random() * candidates.length)]
            : list.length > 0
              ? list[Math.floor(Math.random() * list.length)]
              : null;

        setRandomMovie(rm);

        setPage(1);

        // total_pages 있으면 더 정확
        if (data.total_pages && data.total_pages <= 1) setHasMore(false);
        else setHasMore(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFirst();
  }, [option.url]);

  // 2) 다음 페이지 로딩
  const loadMore = useCallback(async () => {
    if (!hasMore || isFetchingMore) return;

    try {
      setIsFetchingMore(true);

      const nextPage = page + 1;
      const res = await fetch(`${url}&page=${nextPage}`);
      const data = await res.json();

      const nextList: movieItem[] = data.results ?? [];

      if (nextList.length === 0) {
        setHasMore(false);
        return;
      }

      // 중복 제거(안전)
      setMovies((prev) => {
        const prevIds = new Set(prev.map((m) => m.id));
        const merged = [...prev, ...nextList.filter((m) => !prevIds.has(m.id))];
        return merged;
      });

      setPage(nextPage);

      if (data.total_pages && nextPage >= data.total_pages) {
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingMore(false);
    }
  }, [hasMore, isFetchingMore, page, option.url]);

  // 3) IntersectionObserver로 바닥 감지
  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { root: null, rootMargin: '250px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="page mainPage">
      {/* 초기 로딩 오버레이 */}
      {isLoading ? (
        <div className="loading">
          <div className="inner">
            <svg width="80" height="80" viewBox="0 0 50 50" role="status" aria-label="Loading">
              <circle cx="25" cy="25" r="20" fill="none" stroke="#000000" strokeWidth="5" opacity="0.2" />
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="#f1f1f1"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="31.4 125.6"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 25 25"
                  to="360 25 25"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
            <div className="text">영화를 불러오고 있습니다.</div>
          </div>
        </div>
      ) : null}

      {/* 랜덤 메인 배너 */}
      {isRandomMovie && randomMovie ? (
        <div className="mainMovie">
          {/* backdrop_path가 없을 수 있으니 방어 */}
          {randomMovie.backdrop_path ? (
            <img
              src={`https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}`}
              alt={randomMovie.title}
              data-not-lazy
              draggable={false}
            />
          ) : null}

          <div className="contollWrap">
            <div className="container">
              <h3>{randomMovie.title}</h3>
              <p className="exp">{truncateOverview(randomMovie.overview)}</p>

              <div className="buttons">
                <div className="button play" onClick={() => alert('재생 기능은 지원하지 않습니다.')}>
                  재생
                </div>
                <div className="button detail" onClick={() => openDetail(randomMovie)}>
                  상세
                </div>

              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 인기 영화 리스트 */}
      <div className="container">
        {
          isTitle && 
          <h2 className="movieListTitle">인기 영화</h2>
        }

        {
          movies.length === 0 &&
          <div className='empty-movie'>
            영화가 없습니다.
          </div>
        }

        <div className="movieList">
          {movies.map((movie) => (
            <div key={movie.id} className="movieItem">
              {movie.backdrop_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                  alt={movie.title}
                  draggable={false}
                />
              ) : (
                <div className="imgFallback" />
              )}

              <h3 className="movieTitle">{movie.title}</h3>

              <div className="controller">
                <div className="button play" onClick={() => alert('재생기능은 지원하지 않습니다.')}>
                  재생
                </div>
                <div className="button detail" onClick={() => openDetail(movie)}>
                  상세
                </div>
              </div>

              <div
                className={`like-btn ${isLiked(movie.id) ? 'like' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(movie);
                }}
                aria-pressed={isLiked(movie.id)}
              >
                ♥
              </div>
            </div>
          ))}
        </div>

        {/* 무한 스크롤 바닥 감지 */}
        <div ref={bottomRef} style={{ height: 1 }} />

        {/* 추가 로딩 표시 */}
        {/* {isFetchingMore ? <div className="loadingMore">더 불러오는 중...</div> : null} */}
        {/* {!hasMore && movies.length > 0 ? <div className="endMessage">마지막입니다.</div> : null} */}
      </div>

      {/* 상세 모달 */}
      {isModalOpen ? <Detail selectedMovie={selectedMovie} closeDetail={closeDetail} /> : null}
    </div>
  );
}
