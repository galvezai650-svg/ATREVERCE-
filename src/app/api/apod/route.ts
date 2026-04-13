import { NextRequest, NextResponse } from 'next/server'

const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod'
const NASA_API_KEY = 'DEMO_KEY'

const fallbackApod = {
  title: 'Astronomy Picture of the Day',
  explanation:
    'La NASA nos trae cada día una imagen asombrosa del universo. Por el momento, no se pudo conectar con el servicio.',
  url: 'https://apod.nasa.gov/apod/image/2001/PIA23180-1600.jpg',
  media_type: 'image',
  date: new Date().toISOString().split('T')[0],
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const count = searchParams.get('count')

    const params = new URLSearchParams({ api_key: NASA_API_KEY })
    if (count) {
      params.set('count', count)
    }

    const res = await fetch(`${NASA_APOD_URL}?${params.toString()}`, {
      next: { revalidate: 3600 }, // cache for 1 hour
    })

    if (!res.ok) {
      console.error(`NASA APOD API error: ${res.status} ${res.statusText}`)
      if (count) {
        return NextResponse.json([fallbackApod])
      }
      return NextResponse.json(fallbackApod)
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('APOD fetch error:', error)
    const { searchParams } = request.nextUrl
    const count = searchParams.get('count')
    if (count) {
      return NextResponse.json([fallbackApod])
    }
    return NextResponse.json(fallbackApod)
  }
}
