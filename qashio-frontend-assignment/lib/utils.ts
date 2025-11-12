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