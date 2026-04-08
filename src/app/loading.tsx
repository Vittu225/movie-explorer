import styles from '@/components/loading.module.css'

export default function Loading() {
  return (
    <section>
      <div className={styles.grid}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={styles.card}>
            <div className={`${styles.poster} ${styles.shimmer}`} />
            <div className={styles.body}>
              <div className={`${styles.line} ${styles.lineLong} ${styles.shimmer}`} />
              <div className={`${styles.line} ${styles.lineShort} ${styles.shimmer}`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

