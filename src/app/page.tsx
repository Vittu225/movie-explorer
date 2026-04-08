import { getPopularMovies } from '@/lib/api'
import { MovieCard } from '@/components/MovieCard'
import gridStyles from '@/components/MovieGrid.module.css'

type PopularResponse = {
  items: {
    kinopoiskId: number
    nameRu?: string
    nameOriginal?: string
    year?: number
    ratingKinopoisk?: number
    posterUrlPreview?: string
    genres?: { genre: string }[]
  }[]
}

export default async function HomePage() {
  let movies: PopularResponse['items'] = []
  let errorMessage: string | null = null

  try {
    const data = (await getPopularMovies()) as PopularResponse
    movies = data.items ?? []
  } catch (err: unknown) {
    errorMessage = err instanceof Error ? err.message : String(err)
  }

  return (
    <section>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 4 }}>
          Популярные фильмы
        </h1>
        <p style={{ color: 'rgba(148,163,184,0.95)', fontSize: '0.9rem' }}>
          Подборка популярных фильмов с Кинопоиска.
        </p>
      </header>

      {errorMessage ? (
        <p
          style={{
            color: '#fca5a5',
            background: 'rgba(220, 38, 38, 0.10)',
            border: '1px solid rgba(220, 38, 38, 0.25)',
            padding: '12px 14px',
            borderRadius: 12,
            margin: '8px 0 0',
          }}
        >
          Ошибка загрузки: {errorMessage}
        </p>
      ) : (
        <div className={gridStyles.grid}>
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.kinopoiskId}
              movie={movie}
              priority={index < 5}
            />
          ))}
        </div>
      )}
    </section>
  )
}
