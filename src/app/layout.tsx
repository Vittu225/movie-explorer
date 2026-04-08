import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import styles from '@/components/layout.module.css'
import Search from '@/components/Search'

export const metadata: Metadata = {
  title: 'Movie Explorer',
  description: 'Explore movies using Kinopoisk API',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body>
        <div className={styles.shell}>
          <header className={styles.header}>
            <nav className={styles.nav}>
              <Link href="/" className={styles.logo}>
                Movie Explorer
              </Link>

              <div className={styles.search}>
                <Search />
              </div>
            </nav>
          </header>

          <main className={styles.main}>{children}</main>
        </div>
      </body>
    </html>
  )
}
