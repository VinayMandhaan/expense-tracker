import ApartmentIcon from '@mui/icons-material/Apartment';
import CategoryIcon from '@mui/icons-material/Category';

export type NavKey = 'transactions' | 'categories';
export const NAV_ITEMS: Array<{
    key: NavKey;
    label: string;
    href: string;
    icon: typeof ApartmentIcon;
}> = [
        { key: 'transactions', label: 'Transactions', href: '/transactions', icon: ApartmentIcon },
        { key: 'categories', label: 'Categories', href: '/categories', icon: CategoryIcon },
    ];

export const extractErrorMessage = (err: unknown, fallback: string) => {
    if (err instanceof Error) {
        try {
            const parsed = JSON.parse(err.message)
            const message = parsed?.error?.message ?? parsed?.message
            if (Array.isArray(message)) return message.join(', ')
            if (typeof message === 'string') return message
        } catch {
        }
        if (err.message) return err.message
    }
    return fallback
}

export const formatCurrency = (value: number) => {
  return `${value.toLocaleString()} AED`
}