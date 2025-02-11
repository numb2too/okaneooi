// 修改 initSearch 函數
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const clearButton = document.querySelector('.search-clear');
    const tagButtons = document.querySelectorAll('.tag-btn');
    
    let activeFilters = new Set();

    // Tag button click handler
    tagButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            btn.classList.toggle('active');
            
            if (btn.classList.contains('active')) {
                activeFilters.add(type);
            } else {
                activeFilters.delete(type);
            }
            
            const query = searchInput.value.toLowerCase().trim();
            handleSearchAndFilter(query, activeFilters);
        });
    });

    // Search input handler with debounce
    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase().trim();
        clearButton.style.display = query ? 'flex' : 'none';
        
        if (!query && activeFilters.size === 0) {
            resetMapToDefault();
            return;
        }

        handleSearchAndFilter(query, activeFilters);
    }, 300));

    // Clear button handler
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearButton.style.display = 'none';
        activeFilters.clear();
        tagButtons.forEach(btn => btn.classList.remove('active'));
        resetMapToDefault();
    });
}

function handleSearchAndFilter(query, activeFilters) {
    // Filter the data based on search query and active filters
    const filteredData = foodData.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(query.toLowerCase());
        const addressMatch = item.googleUrls[0].addrName.toLowerCase().includes(query.toLowerCase());
        const matchesFilter = activeFilters.size === 0 || 
            (activeFilters.has('food') && !item.isRoute) ||
            (activeFilters.has('route') && item.isRoute);
        
        return (titleMatch || addressMatch) && matchesFilter;
    });

    // Update AppState
    AppState.filteredData = filteredData;

    // Update map visibility
    addMapFeatures(filteredData);

    // Update card view if needed
    if (typeof updateCardView === 'function') {
        updateCardView(filteredData);
    }

    return filteredData;
}

// 新增：重置地圖到預設狀態的函數

function resetMapToDefault() {
    AppState.filteredData = null;
    
    const allCoords = [];
    
    
    addMapFeatures(foodData);
    // Update card view if needed
    if (typeof updateCardView === 'function') {
        updateCardView(foodData);
    }
}

// 更新地圖可見性// 更新地圖可見性的函數// 更新地圖可見性的函數
function updateMapVisibility() {
    console.log('Updating map visibility...');
    if (!AppState.filteredData || AppState.filteredData.length === 0) {
        console.log('No filter applied, showing all markers and routes');
        AppState.allMapFeatures.markers.forEach(({ elements }) => {
            if (elements.marker) AppState.map.addLayer(elements.marker);
            if (elements.titleOverlay) AppState.map.addLayer(elements.titleOverlay);
        });
        AppState.allMapFeatures.routes.forEach(({ elements }) => {
            if (elements.polyline) AppState.map.addLayer(elements.polyline);
            if (elements.titleOverlay) AppState.map.addLayer(elements.titleOverlay);
        });
        return;
    }
    updateMapFeatures();
}


// 在應用程式初始化時調用
document.addEventListener('DOMContentLoaded', () => {
    initSearch();
});