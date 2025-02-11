// 初始化資訊卡視圖
function initCardView() {
    const cardContainer = document.querySelector('.card-container');
    renderCards(cardContainer, AppState.filteredData || foodData);
}


// 渲染所有資訊卡
function renderCards(container, data) {
    container.innerHTML = '';
    data.forEach(item => {
        container.appendChild(createLocationCard(item));
    });
}
// 新增：更新資訊卡視圖的函數
function updateCardView(filteredData) {
    const cardContainer = document.querySelector('.card-container');
    if (cardContainer) {
        renderCards(cardContainer, filteredData);
    }
}

// 創建單個位置卡片
function createLocationCard(item) {
    const card = document.createElement('div');
    card.className = 'location-card';

    // 添加預覽圖片
    if (item.images && item.images.length > 0) {
        const firstImage = item.images.find(img => img.type === 'pic');
        if (firstImage) {
            const img = document.createElement('img');
            img.src = firstImage.url;
            img.alt = item.title;
            img.onclick = () => showLocationDetails(item);
            card.appendChild(img);
        }
    }

    const content = document.createElement('div');
    content.className = 'card-content';

    // 創建標題容器
    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';
    titleContainer.style.display = 'flex';
    titleContainer.style.alignItems = 'center';
    titleContainer.style.gap = '10px';

    // 添加標題
    const title = document.createElement('h3');
    title.textContent = item.title;
    title.onclick = () => showLocationDetails(item);
    titleContainer.appendChild(title);

    // 添加地圖按鈕
    if (item.geoJson && item.geoJson.features) {
        const mapButton = document.createElement('button');
        mapButton.className = 'map-button';
        mapButton.innerHTML = '🗺️';
        mapButton.title = '在地圖上顯示位置';
        mapButton.onclick = () => {
            // 先切換到地圖視圖
            const mapViewButton = document.querySelector('[data-view="map-view"]');
            if (mapViewButton) {
                mapViewButton.click();
            }
            
            // 等待地圖視圖加載完成後再跳轉到位置
            setTimeout(() => {
                flyToLocation(item);
            }, 100); // 給一個小延遲確保地圖已加載
        };
        titleContainer.appendChild(mapButton);
    }

    content.appendChild(titleContainer);

    // 添加標籤
    if (item.tags && item.tags.length > 0) {
        const tagsDiv = document.createElement('div');
        item.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            tagSpan.textContent = tag.name;
            tagsDiv.appendChild(tagSpan);
        });
        content.appendChild(tagsDiv);
    }

    // 添加最新社群連結
    if (item.socialUrls && item.socialUrls.length > 0) {
        const latestSocial = item.socialUrls[item.socialUrls.length - 1];
        const socialLink = document.createElement('a');
        socialLink.href = latestSocial.url;
        socialLink.target = '_blank';
        socialLink.textContent = `${socialIcons[latestSocial.type] || '🔗'} 最新動態`;
        content.appendChild(socialLink);
    }

    card.appendChild(content);
    return card;
}

// 跳轉到地圖位置的函數
// 跳轉到地圖位置的函數
function flyToLocation(item, highlightPolyline) {
    if (item.geoJson && item.geoJson.features) {
        const feature = item.geoJson.features[0];
        if (feature && feature.geometry && feature.geometry.coordinates) {
            if (feature.geometry.type === 'LineString') {
                // 路線的處理
                const coordinates = convertCoordinates(feature.geometry.coordinates);
                highlightPolyline = L.polyline(coordinates, HIGHLIGHT_STYLES.normal.route).addTo(AppState.map);
                
                // 計算路線中點
                const midpointIndex = Math.floor(coordinates.length / 2);
                const midpoint = coordinates[midpointIndex];
                
                // 將地圖中心移動到路線中點
                AppState.map.flyTo(midpoint, 13, { duration: 0.5 });
            } else {
                // 位置的處理
                const [lng, lat] = feature.geometry.coordinates; // GeoJSON uses [longitude, latitude]
                AppState.map.flyTo([lat, lng], 18, { duration: 0.5 });
            }
        }
    }
}

// 初始化資訊卡功能
document.addEventListener('DOMContentLoaded', initCardView);