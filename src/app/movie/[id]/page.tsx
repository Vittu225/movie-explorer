import { getMovieDetails } from '@/lib/api'
import Image from 'next/image'
import styles from './MoviePage.module.css'

type MovieDetails = {
  kinopoiskId: number
  nameRu?: string
  nameOriginal?: string
  year?: number
  description?: string
  posterUrl?: string
  posterUrlPreview?: string
  ratingKinopoisk?: number
  genres?: { genre: string }[]
  countries?: { country: string }[]
}

export default async function MovieDetailsPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>
}) {
  const { id } = await Promise.resolve(params)

  let movie: MovieDetails | null = null
  let errorMessage: string | null = null

  try {
    movie = (await getMovieDetails(id)) as MovieDetails
  } catch (err: unknown) {
    errorMessage = err instanceof Error ? err.message : String(err)
  }

  if (errorMessage) {
    return (
      <section>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 10 }}>
          Ошибка
        </h1>
        <p
          style={{
            color: '#fca5a5',
            background: 'rgba(220, 38, 38, 0.10)',
            border: '1px solid rgba(220, 38, 38, 0.25)',
            padding: '12px 14px',
            borderRadius: 12,
            margin: 0,
          }}
        >
          Не удалось загрузить фильм: {errorMessage}
        </p>
      </section>
    )
  }

  if (!movie) {
    return null
  }

  const title = movie.nameRu || movie.nameOriginal || 'Без названия'
  const genres = (movie.genres ?? []).map((g) => g.genre).filter(Boolean).join(', ')
  const countries = (movie.countries ?? [])
    .map((c) => c.country)
    .filter(Boolean)
    .join(', ')
  const poster = movie.posterUrl || movie.posterUrlPreview || '/placeholder-poster.svg'

  return (
    <section>
      <article className={`${styles.card} ${styles.heroCard}`}>
        <div className={styles.heroPosterWrapper}>
          <Image
            className={styles.heroPoster}
            src={poster}
            alt={title}
            fill
            sizes="(max-width: 720px) 100vw, 280px"
            priority
          />
        </div>

        <div className={styles.heroBody}>
          <div className={styles.heroTitleRow}>
            <div>
              <div className={styles.heroTitle}>{title}</div>
              <div className={styles.heroSub}>
                {movie.year ? <span>{movie.year}</span> : null}
                {movie.year && (genres || countries) ? <span> · </span> : null}
                {genres ? <span>{genres}</span> : null}
                {(genres && countries) ? <span> · </span> : null}
                {countries ? <span>{countries}</span> : null}
              </div>
            </div>

            {movie.ratingKinopoisk != null && (
              <span className={styles.rating}>{movie.ratingKinopoisk}</span>
            )}
          </div>

          {movie.description && (
            <p className={styles.heroDescription}>{movie.description}</p>
          )}

          <div className={styles.ctaRow}>
            <button type="button" className={styles.ctaButton}>
              Смотреть
            </button>
          </div>
        </div>
      </article>
    </section>
  )
}
