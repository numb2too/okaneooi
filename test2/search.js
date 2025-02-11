/* JavaScript 部分 (search.js) */
// 初始化搜尋功能
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    const clearButton = document.querySelector('.search-clear');
    const tagButtons = document.querySelectorAll('.tag-btn');
    
    let activeFilters = new Set();

    // 標籤按鈕點擊處理
    tagButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            btn.classList.toggle('active');
            
            if (btn.classList.contains('active')) {
                activeFilters.add(type);
            } else {
                activeFilters.delete(type);
            }
            
            if (searchInput.value) {
                updateSearchResults(searchInput.value, activeFilters);
            }
        });
    });

    // 搜尋輸入處理
    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase().trim();
        clearButton.style.display = query ? 'flex' : 'none';
        
        if (!query) {
            searchResults.style.display = 'none';
            return;
        }

        updateSearchResults(query, activeFilters);
    }, 300));

    // 清除按鈕處理
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        searchResults.style.display = 'none';
        clearButton.style.display = 'none';
    });
}

// 更新搜尋結果
function updateSearchResults(query, activeFilters) {
    const searchResults = document.querySelector('.search-results');
    
    let filteredData = foodData.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const addressMatch = item.googleUrls[0].addrName.toLowerCase().includes(query);
        const matchesFilter = activeFilters.size === 0 || 
            (activeFilters.has('food') && !item.isRoute) ||
            (activeFilters.has('route') && item.isRoute);
        
        return (titleMatch || addressMatch) && matchesFilter;
    });

    if (filteredData.length === 0) {
        searchResults.innerHTML = '<div class="no-results">找不到符合的結果</div>';
    } else {
        searchResults.innerHTML = filteredData
            .map(item => `
                <div class="search-result-item" data-id="${item.id}">
                    <div class="result-icon">
                        <i class="fas ${item.isRoute ? 'fa-route' : 'fa-utensils'}"></i>
                    </div>
                    <div class="result-info">
                        <div class="result-title">${item.title}</div>
                        <div class="result-address">
                            <i class="fas fa-map-marker-alt"></i>
                            ${item.googleUrls[0].addrName}
                        </div>
                    </div>
                </div>
            `)
            .join('');
    }

    searchResults.style.display = 'block';

    // 添加結果點擊事件
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const selectedItem = foodData.find(
                data => data.id === item.dataset.id
            );
            
            if (selectedItem && selectedItem.geoJson.features[0]) {
                const coords = selectedItem.geoJson.features[0].geometry.coordinates;
                AppState.map.setView([coords[1], coords[0]], 16);
                
                // 找到對應的標記並觸發點擊
                const marker = AppState.markers.find(m => 
                    m.getLatLng().lat === coords[1] && 
                    m.getLatLng().lng === coords[0]
                );
                
                if (marker) {
                    marker.fire('click');
                }
            }

            searchResults.style.display = 'none';
        });
    });
}

// 在應用程式初始化時調用
document.addEventListener('DOMContentLoaded', () => {
    initSearch();
});