const BASE = process.env.NEST_API_URL;

export async function GET() {
    try {
        const categoryResponse = await fetch(`${BASE}/api/categories`, { cache: 'no-store' })
        if (!categoryResponse.ok) {
            const message = await categoryResponse.text()
            throw new Error(message)
        }
        const categories: Array<{ id: string }> = await categoryResponse.json()

        const summaries = await Promise.all(
            categories.map(async ({ id }) => {
                const summaryResponse = await fetch(`${BASE}/api/categories/${id}/summary`, { cache: 'no-store' })
                if(!summaryResponse.ok) {
                    const message = await summaryResponse.text()
                    throw new Error(message)
                }
                return summaryResponse.json()
            })
        )
        return Response.json(summaries);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load categories summary'
        return Response.json({ message }, { status: 500 })
    }
}
