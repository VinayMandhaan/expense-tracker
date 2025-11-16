const BASE = '/api';

async function getError(res: Response) {
    const fallback = 'Something went wrong'
    let message = fallback
    try {
        const text = await res.text()
        if (!text) {
            return new Error(fallback)
        }
        try {
            const data = JSON.parse(text)
            if (typeof data.message === 'string' && data.message.trim()) {
                message = data.message
            } else if (Array.isArray(data.message) && data.message.length > 0) {
                message = data.message[0]
            } else if (typeof data.error === 'string' && data.error.trim()) {
                message = data.error
            } else if (Array.isArray(data.error) && data.error.length > 0) {
                message = data.error[0]
            } else {
                message = text
            }
        } catch {
            message = text
        }
    } catch {
        message = fallback
    }
    return new Error(message || fallback)
}

export async function apiGet<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${url}`, { ...init, cache: 'no-store' })
    if (!res.ok) {
        throw await getError(res)
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
        throw await getError(res)
    }
    return res.json()
}
