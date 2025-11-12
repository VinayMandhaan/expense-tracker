const BASE = '/api';


export async function apiGet<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${url}`, { ...init, cache: 'no-store' })
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Something went wrong');
    }
    return res.json()
}


export async function apiSend<T>(url: string, method: string, body?: any): Promise<T> {
    const res = await fetch(`${BASE}${url}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Something went wrong');
    }
    return res.json()
}