'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'likedMovies';

function safeParse(value: string | null): movieItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

export function useLikedMovies() {
  const [likedMovies, setLikedMovies] = useState<movieItem[]>([]);

  useEffect(() => {
    setLikedMovies(safeParse(localStorage.getItem(STORAGE_KEY)));
  }, []);

  const isLiked = (id: number) =>
    likedMovies.some((movie) => movie.id === id);

  const toggleLike = (movie: movieItem) => {
    setLikedMovies((prev) => {
      let next: movieItem[];

      if (prev.some((m) => m.id === movie.id)) {
        next = prev.filter((m) => m.id !== movie.id);
      } else {
        next = [...prev, movie];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return { likedMovies, isLiked, toggleLike };
}
