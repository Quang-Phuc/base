import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Import Service và Model
import { News, NewsService, NewsStatus } from "@features/news/data-access/news.service";

@Component({
    selector: 'app-news-management',
    standalone: true,
    imports: [CommonModule, FormsModule, CKEditorModule],
    templateUrl: './news-management.component.html',
    styleUrls: ['./news-management.component.scss']
})
export class NewsManagementComponent implements OnInit {
    private newsService = inject(NewsService);

    // --- CKEditor Configuration ---
    // Sử dụng default export để tránh lỗi build-classic không có 'create'
    public Editor: any = ClassicEditor;
    isSourceView = false;

    public editorConfig = {
        toolbar: [
            'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList',
            'blockQuote', 'insertTable', 'undo', 'redo'
        ],
        placeholder: 'Nhập nội dung bài viết hoặc Spintax tại đây...',
        language: 'vi'
    };

    // --- Categories ---
    public categories = [
        { label: 'Xổ số Miền Bắc', value: 'XSMB' },
        { label: 'Vietlott', value: 'VIETLOTT' },
        { label: 'StayMaster News', value: 'STAYMASTER' },
        { label: 'Kinh nghiệm SEO', value: 'SEO' }
    ];

    // --- State Signals ---
    rows = signal<News[]>([]);
    total = signal(0);
    page = signal(0);
    pageSize = signal(10);
    keyword = signal('');
    selectedCategory = signal<string>('');
    loading = signal(false);

    isModalOpen = signal(false);
    isEditMode = signal(false);
    currentId = signal<number | null>(null);

    postForm = {
        title: '',
        slug: '',
        category: 'XSMB',
        content: '',
        summary: '',
        status: NewsStatus.DRAFT,
        thumbnail: null as File | null
    };

    ngOnInit() {
        this.fetchData();
    }

    onEditorReady(editor: any): void {
        // Nếu hiện log này ở console là editor đã chạy thành công
        console.log('CKEditor 5 is ready!', editor);
    }

    toggleSourceView() {
        this.isSourceView = !this.isSourceView;
    }

    fetchData() {
        this.loading.set(true);
        const payload = {
            page: this.page(),
            size: this.pageSize(),
            keyword: this.keyword() || null,
            category: this.selectedCategory() || null
        };

        this.newsService.searchNews(payload).subscribe({
            next: (res) => {
                this.rows.set(res.content);
                this.total.set(res.totalElements);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Lỗi lấy danh sách bài viết:', err);
                this.loading.set(false);
            }
        });
    }

    onSearch(event: any) {
        const value = (event.target as HTMLInputElement).value;
        this.keyword.set(value);
        this.page.set(0);
        this.fetchData();
    }

    onCategoryChange(event: any) {
        const value = (event.target as HTMLSelectElement).value;
        this.selectedCategory.set(value);
        this.page.set(0);
        this.fetchData();
    }

    openAddModal() {
        this.isEditMode.set(false);
        this.resetForm();
        this.isModalOpen.set(true);
    }

    openEditModal(id: number) {
        this.isEditMode.set(true);
        this.currentId.set(id);
        this.newsService.getNews(id).subscribe({
            next: (data) => {
                this.postForm = {
                    title: data.title,
                    slug: data.slug,
                    category: data.category,
                    content: data.content,
                    summary: data.summary,
                    status: data.status,
                    thumbnail: null
                };
                this.isModalOpen.set(true);
            }
        });
    }

    onFileChange(event: any) {
        const files = event.target.files;
        if (files?.length > 0) this.postForm.thumbnail = files[0];
    }

    savePost() {
        const formData = new FormData();
        Object.entries(this.postForm).forEach(([key, value]) => {
            if (value !== null) formData.append(key, value as any);
        });

        const request = this.isEditMode()
            ? this.newsService.updateNews(this.currentId()!, formData)
            : this.newsService.createNews(formData);

        request.subscribe({
            next: () => {
                this.isModalOpen.set(false);
                this.fetchData();
                this.resetForm();
            }
        });
    }

    deletePost(id: number) {
        if (confirm('Xóa bài này sẽ ảnh hưởng đến SEO (xosothanden.com), bạn chắc chứ?')) {
            this.newsService.deleteNews(id).subscribe(() => this.fetchData());
        }
    }

    resetForm() {
        this.postForm = {
            title: '', slug: '', category: 'XSMB',
            content: '', summary: '', status: NewsStatus.DRAFT, thumbnail: null
        };
        this.currentId.set(null);
    }

    changePage(delta: number) {
        const nextPage = this.page() + delta;
        if (nextPage >= 0 && (delta < 0 || (nextPage * this.pageSize() < this.total()))) {
            this.page.set(nextPage);
            this.fetchData();
        }
    }

    refresh() {
        this.page.set(0);
        this.fetchData();
    }

    get totalPages(): number {
        return Math.ceil(this.total() / this.pageSize());
    }

    protected readonly Math = Math;
}
