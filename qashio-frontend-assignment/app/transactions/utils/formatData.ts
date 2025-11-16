export const formatAmount = (value?: number | null) => {
    if (value === null || value === undefined) {
        return '-'
    }
    return Number(value).toLocaleString()
}
export const formatDate = (value?: string | null) => {
    if (!value) {
        return '-'
    }
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return value
    }
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}