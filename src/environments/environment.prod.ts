export const environment = {
    production: false,

    // --- API Configuration ---
    apiBaseUrl: 'http://10.2.9.242:8080/api',

    // --- Firebase Configuration (Bê từ dự án cũ của Phúc) ---
    firebase: {
        apiKey: "AIzaSyB0kFSXm2yIkOIseMVd9FqvqZt854pm9AE",
        authDomain: "student-686f8.firebaseapp.com",
        databaseURL: "https://student-686f8-default-rtdb.firebaseio.com",
        projectId: "student-686f8",
        storageBucket: "student-686f8.appspot.com",
        messagingSenderId: "886758319983",
        appId: "1:886758319983:web:846852301635d81672ea9a",
        measurementId: "G-FVGHHFJV8Z",

        // Key này dùng để xin quyền hiện thông báo (Web Push certificates)
        vapidKey: "BIxem_f9NUCA_50H68fBrL-5k8QqDgn62AvtfmN7cbjJl0WDbYDCicpKjH7ZxGf7Ey9-DA_o3nFcUNwl1IzVHwY"
    },

    // --- Các cấu hình khác nếu cần (Ví dụ của dự án cũ bồ đưa) ---
    clientId: "897040496301-tf87sudp5datllf1ss6h33moumljbq2s.apps.googleusercontent.com",
    redirectUri: "https://svshare.vn"
};
