export const parseSort = (sort?: string): [string, 'ASC' | 'DESC'][] => {
    if (!sort) return []
    return sort.split(',').map(rule => {
        const [field, dir] = rule.split(':')
        return [field, (dir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC')] as
            [string, 'ASC' | 'DESC']
    });
};