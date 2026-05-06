// news.model.ts
export interface NewsPost {
    id?: number;
    title: string;
    slug: string;
    category: string;
    status: 'DRAFT' | 'PUBLISHED';
    isIndexed: boolean;
    fbShareCount: number;
    spintaxContent?: string;
    createdAt: Date;
}

export const CATEGORIES = [
    { value: 'XOSO', label: 'Xổ Số' },
    { value: 'STAYMASTER', label: 'StayMaster' },
    { value: 'KNOWLEDGE', label: 'Kiến thức' }
];
