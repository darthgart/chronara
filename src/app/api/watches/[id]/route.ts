import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${API_URL}/watches/${params.id}`)
    if (!res.ok) throw new Error('Error fetching watch')
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error fetching watch' }, { status: 500 })
  }
}
