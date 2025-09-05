import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/types`)
    if (!res.ok) throw new Error('Error fetching watches')
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Error fetching watches' },
      { status: 500 }
    )
  }
}
