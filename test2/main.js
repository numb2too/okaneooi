// 應用程式狀態管理
const AppState = {
    currentView: 'map-view',
    selectedLocation: null,
    map: null,
    markers: [],
    routes: [],
    allMapFeatures: {
        markers: [],
        routes: [],
        titles: []
    },
    filteredData: null  // 新增：追踪當前過濾後的資料
};

// 視圖切換處理
function initViewSwitching() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按鈕狀態
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 更新視圖
            const viewId = btn.dataset.view;
            document.querySelectorAll('.view').forEach(view => {
                view.classList.remove('active');
            });
            document.getElementById(viewId).classList.add('active');

            // 更新應用程式狀態
            AppState.currentView = viewId;

            // 如果切換到地圖視圖，重新調整地圖大小
            if (viewId === 'map-view' && AppState.map) {
                AppState.map.invalidateSize();
            }
        });
    });
}

// 視窗大小變化處理
function initResizeHandler() {
    const resizeHandler = debounce(() => {
        if (AppState.map) {
            AppState.map.invalidateSize();
        }
    }, 250);

    window.addEventListener('resize', resizeHandler);
}

// 初始化應用程式
function initApp() {
    initViewSwitching();
    initResizeHandler();
}

// DOM 載入完成後初始化應用程式
document.addEventListener('DOMContentLoaded', initApp);