import Image from 'next/image'
import styles from './MovieCard.module.css'
import Link from 'next/link'
type Movie = {
  kinopoiskId: number
  nameRu?: string
  nameOriginal?: string
  year?: number
  ratingKinopoisk?: number
  posterUrlPreview?: string
  genres?: { genre: string }[]
}

type Props = {
  movie: Movie
  priority?: boolean
}

export function MovieCard({ movie, priority = false }: Props) {
  const title = movie.nameRu || movie.nameOriginal || 'Без названия'
  const genre = movie.genres?.[0]?.genre

  return (
    <Link href={`/movie/${movie.kinopoiskId}`} className={styles.cardLink}>
    <article className={styles.card}>
      <div className={styles.posterWrapper}>
        <Image
          className={styles.poster}
          src={movie.posterUrlPreview || '/placeholder-poster.svg'}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          priority={priority}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{title}</h2>
          {movie.ratingKinopoisk != null && (
            <span className={styles.rating}>{movie.ratingKinopoisk}</span>
          )}
        </div>

        {genre && (
          <div className={styles.meta}>
            <span>{genre}</span>
            {movie.year && <span> · {movie.year}</span>}
          </div>
        )}
      </div>
    </article>
    </Link>
  )
}

