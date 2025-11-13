import { NextRequest } from 'next/server';

const BASE = process.env.NEST_API_URL;


export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${BASE}/api/transactions/${params.id}`, { cache: 'no-store' })
  const body = await res.text()
  return new Response(
    body, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.text()
  const res = await fetch(`${BASE}/api/transactions/${params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
  const resBody = await res.text()
  return new Response(
    resBody, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${BASE}/api/transactions/${params.id}`, { method: 'DELETE' })
  const resBody = await res.text()
  return new Response(
    resBody, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  })
}
