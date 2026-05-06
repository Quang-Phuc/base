import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsPost, CATEGORIES } from './news.model';

@Component({
    selector: 'app-news-management',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './news-management.component.html',
    styleUrls: ['./news-management.component.scss']
})
export class NewsManagementComponent implements OnInit {
    // --- Signals quản lý State ---
    rows = signal<NewsPost[]>([]);
    total = signal(0);
    page = signal(0);
    pageSize = signal(10);
    keyword = signal('');
    selectedCategory = signal<string>('');
    loading = signal(false);

    categories = CATEGORIES;

    // --- Computed: Tự động lọc dữ liệu khi keyword hoặc category thay đổi ---
    filteredRows = computed(() => {
        let data = this.rows();

        // 1. Lọc theo từ khóa (Tiêu đề hoặc Slug)
        if (this.keyword()) {
            const search = this.keyword().toLowerCase();
            data = data.filter(r =>
                r.title.toLowerCase().includes(search) ||
                r.slug.toLowerCase().includes(search)
            );
        }

        // 2. Lọc theo chuyên mục (XOSO, STAYMASTER...)
        if (this.selectedCategory()) {
            data = data.filter(r => r.category === this.selectedCategory());
        }

        // 3. Phân trang tại Client (Sau này bạn có thể thay bằng gọi API phân trang)
        const start = this.page() * this.pageSize();
        const end = start + this.pageSize();

        return data.slice(start, end);
    });

    // Tính toán tổng số trang dựa trên dữ liệu đã lọc
    totalPages = computed(() => {
        const filteredLength = this.rows().filter(r => {
            const search = this.keyword().toLowerCase();
            const matchKey = r.title.toLowerCase().includes(search) || r.slug.toLowerCase().includes(search);
            const matchCat = this.selectedCategory() ? r.category === this.selectedCategory() : true;
            return matchKey && matchCat;
        }).length;
        return Math.ceil(filteredLength / this.pageSize());
    });

    ngOnInit() {
        this.fetchData();
    }

    fetchData() {
        this.loading.set(true);
        // Giả lập dữ liệu từ Backend cho xosothanden.com và StayMaster
        setTimeout(() => {
            const mockData: NewsPost[] = [
                { id: 1, title: 'Kết quả XSMB 06/05 - Soi cầu chuẩn', slug: 'xsmb-06-05', category: 'XOSO', status: 'PUBLISHED', isIndexed: true, fbShareCount: 120, createdAt: new Date() },
                { id: 2, title: 'Hướng dẫn dùng StayMaster quản lý nhà trọ', slug: 'huong-dan-staymaster', category: 'STAYMASTER', status: 'DRAFT', isIndexed: false, fbShareCount: 0, createdAt: new Date() },
                { id: 3, title: 'Bí kíp soi cầu Vietlott cực đỉnh', slug: 'soi-cau-vietlott', category: 'XOSO', status: 'PUBLISHED', isIndexed: true, fbShareCount: 85, createdAt: new Date() },
                { id: 4, title: 'Quy trình vận hành chung cư mini', slug: 'quy-trinh-van-hanh', category: 'STAYMASTER', status: 'PUBLISHED', isIndexed: false, fbShareCount: 12, createdAt: new Date() },
                // Thêm data để test phân trang...
            ];
            this.rows.set(mockData);
            this.total.set(mockData.length);
            this.loading.set(false);
        }, 500);
    }

    // --- Event Handlers ---
    onSearch(event: any) {
        this.keyword.set(event.target.value);
        this.page.set(0); // Reset về trang 1
    }

    onCategoryChange(event: any) {
        this.selectedCategory.set(event.target.value);
        this.page.set(0);
    }

    changePage(delta: number) {
        const nextPage = this.page() + delta;
        if (nextPage >= 0 && nextPage < this.totalPages()) {
            this.page.set(nextPage);
        }
    }

    deletePost(id: any) {
        if(confirm('Xóa bài này sẽ ảnh hưởng đến SEO và bot Facebook, bạn chắc chứ?')) {
            // Gọi service xóa thực tế ở đây
            this.rows.update(r => r.filter(p => p.id !== id));
            this.total.update(t => t - 1);
        }
    }

    openAddModal() {
        console.log("Mở form đăng bài với cấu hình Spintax...");
        // Inject AddModalService để mở form như project cũ của bạn
    }

    editPost(item: NewsPost) {
        console.log("Chỉnh sửa bài viết:", item.title);
    }

    refresh() {
        this.fetchData();
    }
}
