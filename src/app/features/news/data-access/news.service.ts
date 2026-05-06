import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/http/api-client';

/**
 * ✅ 1. Enum Trạng thái bài viết
 */
export enum NewsStatus {
  PUBLISHED = 'PUBLISHED', // Đã xuất bản
  DRAFT = 'DRAFT',         // Bản nháp
  ARCHIVED = 'ARCHIVED'    // Lưu trữ/Ẩn
}

/**
 * ✅ 2. Interface cho danh sách rút gọn (hiển thị ở Table)
 */
/**
 * ✅ 2. Interface cho danh sách rút gọn (hiển thị ở Table)
 */
export interface News {
    id: number;
    title: string;
    slug: string;
    thumbnail: string;
    category: string;
    status: NewsStatus;
    authorName: string;
    viewCount: number;
    publishedAt: string;
    isIndexed: boolean;      // 👈 Bổ sung trường này để fix lỗi TS2339 trong HTML
    fbShareCount?: number;   // 👈 Bổ sung thêm trường này vì HTML cũ của bạn có dùng
    statusLabel?: string;
    categoryLabel?: string;
    schemaData?: string;
}

/**
 * ✅ 3. Interface chi tiết bài viết (dùng cho Form Sửa/Chi tiết)
 */
export interface NewsDetail extends News {
  summary: string;        // Mô tả ngắn cho SEO Meta Description
  content: string;        // Nội dung chính (HTML từ Editor)
  tags: string[];         // Các từ khóa liên quan
  metaTitle?: string;     // Tiêu đề SEO riêng (nếu cần)
  createdAt?: string;
  updatedAt?: string;
}

export interface PagedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

/**
 * ✅ 4. Interface cho thống kê bài viết
 */
export interface NewsSummary {
  totalNews: number;
  totalViews: number;
  publishedCount: number;
  draftCount: number;
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  constructor(private api: ApiClient) {}

  /**
   * 1. Tìm kiếm và phân trang bài viết
   */
  searchNews(body: any): Observable<PagedResponse<News>> {
    return this.api.postData<PagedResponse<News>>('news/search', body);
  }

  searchNewsPublic(body: any): Observable<PagedResponse<News>> {
    return this.api.postData<PagedResponse<News>>('news/search-public', body);
  }

  /**
   * 2. Lấy chi tiết bài viết theo ID
   */
  getNews(id: number): Observable<NewsDetail> {
    return this.api.getData<NewsDetail>(`news/${id}`);
  }

  /**
   * 3. Tạo mới bài viết (Dùng Multipart để upload ảnh thumbnail)
   */
  createNews(formData: FormData): Observable<News> {
    return this.api.postMultipart<News>('news/create', formData);
  }

  /**
   * 4. Cập nhật bài viết
   */
  updateNews(id: number, formData: FormData): Observable<News> {
    return this.api.postMultipart<News>(`news/${id}`, formData);
  }

  /**
   * 5. Xóa bài viết
   */
  deleteNews(id: number): Observable<any> {
    return this.api.deleteData<any>(`news/${id}`);
  }

  /**
   * 6. Lấy thống kê (Dashboard News)
   */
  getSummary(params: any): Observable<NewsSummary> {
    return this.api.getData<NewsSummary>('news/summary', params);
  }

  /**
   * 7. Xuất danh sách bài viết/Thống kê ra Excel
   */
  exportNews(body: any): Observable<Blob> {
    return this.api.postDataForBlob('news/export', body);
  }

  /**
   * 8. Thay đổi trạng thái bài viết nhanh (vd: Đăng/Gỡ bài)
   */
  updateStatus(id: number, status: NewsStatus): Observable<any> {
    return this.api.putData<any>(`news/${id}/status`, { status });
  }

  /**
   * 9. Lấy bài viết theo Slug (Dùng cho trang ngoài Landing Page)
   */
  getNewsBySlug(slug: string): Observable<NewsDetail> {
    return this.api.getData<NewsDetail>(`news/public/${slug}`);
  }
}
