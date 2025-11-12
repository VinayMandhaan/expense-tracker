const BASE = '/api';


export async function apiGet<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`http://localhost:3001${BASE}${url}`, { ...init, cache: 'no-store' })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
}


export async function apiSend<T>(url: string, method: string, body?: any): Promise<T> {
    const res = await fetch(`http://localhost:3001${BASE}${url}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(await res.text())
    return res.json()
}