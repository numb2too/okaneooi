// 全局變數
let map;
let activeFilters = new Set();
let routeLayers = new Map();
let loadedRoutes = [];

// 初始化地圖
function initMap() {
    map = L.map('map').setView([23.5, 121], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// 初始化篩選器
function initializeFilters() {
    const attractionsSet = new Set();
    loadedRoutes.forEach(route => {
        route.attractions.forEach(attr => attractionsSet.add(attr));
    });

    const filterContainer = document.getElementById('attraction-filters');
    filterContainer.innerHTML = ''; // 清空現有篩選器
    attractionsSet.forEach(attr => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = attr;
        btn.onclick = () => toggleFilter(attr, btn);
        filterContainer.appendChild(btn);
    });
}

// 切換篩選器
function toggleFilter(filter, btn) {
    if (activeFilters.has(filter)) {
        activeFilters.delete(filter);
        btn.classList.remove('active');
    } else {
        activeFilters.add(filter);
        btn.classList.add('active');
    }
    filterRoutes();
}

// 篩選路線
function filterRoutes() {
    const filteredRoutes = activeFilters.size === 0 ? 
        loadedRoutes : 
        loadedRoutes.filter(route => 
            route.attractions.some(attr => activeFilters.has(attr))
        );
    displayRoutes(filteredRoutes);
}

// 顯示路線
function displayRoutes(routesToShow = loadedRoutes) {
    const resultsContainer = document.getElementById('route-results');
    resultsContainer.innerHTML = '';

    // 清除地圖上現有的路線
    routeLayers.forEach(layer => map.removeLayer(layer));
    routeLayers.clear();

    // 如果只顯示了一條路線，添加重置按鈕
    if (routesToShow.length === 1) {
        const resetButton = document.createElement('button');
        resetButton.className = 'reset-filter-btn';
        resetButton.innerHTML = '顯示所有路線 <i class="fas fa-sync"></i>';
        resetButton.onclick = () => {
            // 重置篩選器
            activeFilters.clear();
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 顯示所有路線
            displayRoutes(loadedRoutes);
        };
        resultsContainer.appendChild(resetButton);
    }

    routesToShow.forEach(route => {
        // 創建結果卡片
        const card = document.createElement('div');
        card.className = 'route-card';
        card.setAttribute('data-route-id', route.id);
        
        // 使用 YouTube 視頻 ID 生成縮圖 URL
        const videoId = route.youtube.split('/').pop();
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        
        card.innerHTML = `
            <h3 class="route-card-title">${route.name}</h3>
            <p>${route.attractions.join(', ')}</p>
            <img src="${thumbnailUrl}" alt="${route.name}" class="route-thumbnail">
        `;
        
        // 為標題添加點擊事件（跳轉到地圖）
        const title = card.querySelector('.route-card-title');
        title.onclick = () => {
            focusRoute(route);
        };
        
        // 為縮圖添加點擊事件（打開 YouTube）
        const thumbnail = card.querySelector('.route-thumbnail');
        thumbnail.onclick = () => {
            window.open(route.youtube, '_blank');
        };
        
        resultsContainer.appendChild(card);

        // 在地圖上添加路線
        const layer = L.geoJSON(route.geoJson).addTo(map);
        routeLayers.set(route.id, layer);
        
        layer.on('click', () => {
            // 顯示右側結果面板
            const resultsPanel = document.querySelector('.results-panel');
            const toggleResultsBtn = document.getElementById('toggleResults');
            resultsPanel.classList.remove('hidden');
            toggleResultsBtn.classList.add('panel-visible');
            
            // 只顯示被點擊的路線
            displayRoutes([route]);
            
            // 聚焦到該路線
            focusRoute(route);
            
            // 延遲一下再滾動到卡片位置，確保面板已經完全展開
            setTimeout(() => {
                const updatedCard = document.querySelector(`[data-route-id="${route.id}"]`);
                if (updatedCard) {
                    updatedCard.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        });
    });
}
// 聚焦路線
function focusRoute(route) {
    const layer = routeLayers.get(route.id);
    if (layer) {
        map.fitBounds(layer.getBounds());
    }
}

// 搜尋功能
document.querySelector('.search-box').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredRoutes = loadedRoutes.filter(route => 
        route.name.toLowerCase().includes(searchTerm) ||
        route.attractions.some(attr => 
            attr.toLowerCase().includes(searchTerm)
        )
    );
    displayRoutes(filteredRoutes);
});

// 初始化面板控制
function initializePanelControls() {
    const filterPanel = document.querySelector('.filter-panel');
    const resultsPanel = document.querySelector('.results-panel');
    const toggleFilterBtn = document.getElementById('toggleFilter');
    const toggleResultsBtn = document.getElementById('toggleResults');

    // 設置初始狀態
    filterPanel.classList.add('hidden');
    resultsPanel.classList.add('hidden');

    toggleFilterBtn.addEventListener('click', () => {
        filterPanel.classList.toggle('hidden');
        toggleFilterBtn.classList.toggle('panel-visible');
    });

    toggleResultsBtn.addEventListener('click', () => {
        resultsPanel.classList.toggle('hidden');
        toggleResultsBtn.classList.toggle('panel-visible');
    });
}

// 調整地圖大小
function updateMapSize() {
    if (map) {
        map.invalidateSize();
    }
}

// 初始化應用
async function initializeApp() {
    initMap();
    try {
        loadedRoutes = await loadRoutes();
        initializeFilters();
        displayRoutes();
        
        // 如果有路線，自動縮放地圖到第一條路線
        if (loadedRoutes.length > 0) {
            const firstRoute = loadedRoutes[0];
            const layer = routeLayers.get(firstRoute.id);
            if (layer) {
                map.fitBounds(layer.getBounds());
            }
        }
    } catch (error) {
        console.error('Error initializing app:', error);
    }
    
    // 初始化面板控制
    initializePanelControls();
    
    // 監聽面板變化以更新地圖大小
    const panels = document.querySelectorAll('.filter-panel, .results-panel');
    panels.forEach(panel => {
        panel.addEventListener('transitionend', updateMapSize);
    });
}

// 啟動應用
document.addEventListener('DOMContentLoaded', initializeApp);