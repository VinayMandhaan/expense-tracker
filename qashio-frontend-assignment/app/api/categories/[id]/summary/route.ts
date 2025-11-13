import { NextRequest } from 'next/server';

const BASE = process.env.NEST_API_URL;

export async function GET(_req: NextRequest, { params }: { params: { id?: string } }) {
    const id = params?.id?.trim()
    try {
        const res = await fetch(`${BASE}/api/categories/${id}/summary`, { cache: 'no-store' })
        const body = await res.text()
        return new Response(body, {
            status: res.status,
            headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get category summary'
        return Response.json({ message }, { status: 500 })
    }
}
