import { NextRequest } from 'next/server';


const BASE = process.env.NEST_API_URL!


export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const qs = url.searchParams.toString()
    const res = await fetch(`${BASE}/api/transactions?${qs}`, { cache: 'no-store' })
    return new Response(await res.text(), { status: res.status, headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' } })
}


export async function POST(req: NextRequest) {
    const body = await req.text()
    const res = await fetch(`${BASE}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
    })
    return new Response(await res.text(), { status: res.status, headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' } })
}
