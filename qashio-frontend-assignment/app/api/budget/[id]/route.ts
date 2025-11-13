import { NextRequest } from 'next/server';


const BASE = process.env.NEST_API_URL!;


export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const res = await fetch(`${BASE}/api/budget/${params.id}`, { method: 'DELETE' })
    const body = await res.text()
    return new Response(body, {
        status: res.status,
        headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' }
    })
}
