'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { searchMovies } from '@/lib/api'
import styles from './Search.module.css'

type Movie = {
  kinopoiskId?: number
  filmId?: number
  nameRu?: string
  nameOriginal?: string
  ratingKinopoisk?: number
  posterUrlPreview?: string
}

type SearchResponse = {
  films?: Movie[]
  items?: Movie[]
}

export default function Search() {
  const [text, setText] = useState('')
  const [debounced, setDebounced] = useState('')
  const [items, setItems] = useState<Movie[]>([])

  const requestIdRef = useRef(0)

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebounced(text.trim())
    }, 500)

    return () => {
      window.clearTimeout(t)
    }
  }, [text])

  useEffect(() => {
    const keyword = debounced
    if (!keyword) {
      window.setTimeout(() => setItems([]), 0)
      return
    }

    const currentId = ++requestIdRef.current

    ;(async () => {
      try {
        const data = (await searchMovies(keyword)) as SearchResponse;
        if (requestIdRef.current === currentId) {
          const foundItems = data.films || data.items || [];
          setItems(foundItems);
        }
      } catch (err) {
        if (requestIdRef.current === currentId) {
          setItems([])
        }
      }
    })()
  }, [debounced])

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Поиск фильмов…"
        autoComplete="off"
      />

      {items.length > 0 && (
        <div className={styles.results}>
          {items.slice(0, 8).map((movie) => {
             const id = movie.kinopoiskId || (movie as Movie).filmId; 
            const title = movie.nameRu || movie.nameOriginal || 'Без названия'
            return (
              <Link
                key={id}
                href={`/movie/${id}`}
                className={styles.resultLink}
                onClick={() => setText('')}
              >
                <div className={styles.resultTitle}>{title}</div>
                {movie.ratingKinopoisk != null && (
                  <div className={styles.resultMeta}>
                    <span className={styles.rating}>{movie.ratingKinopoisk}</span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

