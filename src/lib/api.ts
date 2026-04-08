type FetchKPOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>
}

const DEFAULT_BASE_URL = 'https://kinopoiskapiunofficial.tech'
const API_PREFIX = '/api/v2.2'

export async function fetchKP<T>(
  endpoint: string,
  options: FetchKPOptions = {}
): Promise<T> {
  const apiKey = process.env.NEXT_PUBLIC_KP_API_KEY
  if (!apiKey) {
    throw new Error('Missing NEXT_PUBLIC_KP_API_KEY in environment')
  }

  const baseFromEnv = process.env.NEXT_PUBLIC_KP_BASE_URL
  const base = (baseFromEnv ?? DEFAULT_BASE_URL).replace(/\/+$/, '')
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = new URL(`${API_PREFIX}${normalizedEndpoint}`, base)


  console.log('[fetchKP] request', {
    url: url.toString(),
    hasApiKey: Boolean(apiKey),
  })

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        'X-API-KEY': apiKey,
        Accept: 'application/json',
      },
    })

    console.log('[fetchKP] response', {
      url: url.toString(),
      status: res.status,
      ok: res.ok,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.log('[fetchKP] error body', {
        url: url.toString(),
        text: text?.slice(0, 500),
      })
      throw new Error(`KP API error ${res.status}: ${text || res.statusText}`)
    }

    try {
      return (await res.json()) as T
    } catch {
      const text = await res.text().catch(() => '')
      console.log('[fetchKP] invalid json body', {
        url: url.toString(),
        status: res.status,
      })
      throw new Error(
        `KP API returned non-JSON response ${res.status}: ${
          text?.slice(0, 500) || res.statusText
        }`
      )
    }
  } catch (err: unknown) {
    console.log('[fetchKP] fetch failed', {
      url: url.toString(),
      error: err instanceof Error ? err.message : String(err),
    })
    throw err instanceof Error ? err : new Error(String(err))
  }
}

export function getPopularMovies() {
  return fetchKP('/films/collections?type=TOP_POPULAR_ALL')
}

export function getMovieDetails(id: string) {
  return fetchKP(`/films/${encodeURIComponent(id)}`)
}

export function searchMovies(keyword: string) {
  const q = encodeURIComponent(keyword)
  return fetchKP(`/films?keyword=${q}`)
}
