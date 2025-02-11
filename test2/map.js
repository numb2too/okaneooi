// 初始化地圖
function initMap() {
    // 創建地圖實例
    AppState.map = L.map('map').setView([24.3451924, 120.6235944], 11);
    
    // 添加底圖
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(AppState.map);

    // 跟踪當前選中的元素
    AppState.currentHighlight = null;

    // 點擊地圖時清除高亮
    AppState.map.on('click', clearHighlight);

    // 添加所有標記和路線
    addMapFeatures();
}

// 清除當前高亮
function clearHighlight(e) {
    if (e && e.originalEvent && e.originalEvent.target.classList.contains('marker-title')) {
        return; // 忽略標題點擊事件
    }
    
    if (AppState.currentHighlight) {
        const { elements, styles } = AppState.currentHighlight;
        elements.titleOverlay._icon.classList.remove('highlight');
        if (elements.polyline) {
            elements.polyline.setStyle(styles.normal);
        }
    }
    AppState.currentHighlight = null;
}

// 添加地圖特徵（標記和路線）
function addMapFeatures() {
    foodData.forEach(item => {
        if (item.geoJson && item.geoJson.features) {
            item.geoJson.features.forEach(feature => {
                if (feature.geometry.type === 'Point') {
                    addMarker(feature, item);
                } else if (feature.geometry.type === 'LineString') {
                    addRoute(feature, item);
                }
            });
        }
    });
}// 清除當前高亮
function clearHighlight(e) {
    if (e && e.originalEvent && e.originalEvent.target.classList.contains('marker-title')) {
        return; // 忽略標題點擊事件
    }
    
    if (AppState.currentHighlight) {
        const { elements, styles } = AppState.currentHighlight;
        elements.titleOverlay._icon.classList.remove('highlight');
        if (elements.marker) {
            elements.marker._icon.classList.remove('highlight');  // 移除 marker 的高亮
        }
        if (elements.polyline) {
            elements.polyline.setStyle(styles.normal);
        }
    }
    AppState.currentHighlight = null;
}
// 添加標記
function addMarker(feature, item) {
    const [lng, lat] = feature.geometry.coordinates;
    
    // 使用默認 marker
    const marker = L.marker([lat, lng]).addTo(AppState.map);
    
    // 創建標題
    const titleOverlay = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'marker-title-container',
            html: `<div class="marker-title">${item.title}</div>`,
            iconSize: [120, 30],
            iconAnchor: [15, 30]
        })
    }).addTo(AppState.map);
    
    // 存儲標記引用
    AppState.markers.push(marker);
    AppState.markers.push(titleOverlay);
    
    // 事件處理
    const elements = { marker, titleOverlay };
    const styles = {
        normal: { color: '#1976d2', weight: 3 },
        highlight: { color: '#fbc02d', weight: 5 }
    };

    const clickHandler = (e) => {
        e.originalEvent.stopPropagation();
        clearHighlight();
        AppState.currentHighlight = { elements, styles };
        titleOverlay._icon.classList.add('highlight');
        marker._icon.classList.add('highlight');  // 添加高亮 class
        
        lastLatLng = e.latlng;
        AppState.map.flyTo(e.latlng, 18, { duration: 0.5 });
        
        showSimpleInfoPopup(item, (clickedItem) => {
            showLocationDetails(clickedItem);
        });
        
        document.getElementById('resetViewBtn').style.display = 'block';
    };
    
    const highlightHandler = () => {
        if (!AppState.currentHighlight) {
            titleOverlay._icon.classList.add('highlight');
            marker._icon.classList.add('highlight');  // hover 時也添加高亮
        }
    };
    
    const unhighlightHandler = () => {
        if (!AppState.currentHighlight) {
            titleOverlay._icon.classList.remove('highlight');
            marker._icon.classList.remove('highlight');  // 移除高亮
        }
    };
    
    // 綁定事件
    marker.on({
        'click': clickHandler,
        'mouseover': highlightHandler,
        'mouseout': unhighlightHandler
    });
    
    titleOverlay.on({
        'click': clickHandler,
        'mouseover': highlightHandler,
        'mouseout': unhighlightHandler
    });
}
// 顯示簡單資訊彈窗
function showSimpleInfoPopup(item, onThumbnailClick) {
    // 創建簡單資訊內容
    const popupContent = document.createElement('div');
    popupContent.classList.add('simple-info-popup');
    popupContent.innerHTML = `
        <img src="${item.thumbnail}" alt="${item.title}" class="info-thumbnail">
        <div class="info-title">${item.title}</div>
        <div class="info-address">${item.address || '地址未知'}</div>
    `;

    // 點擊縮圖時顯示詳細資訊
    popupContent.querySelector('.info-thumbnail').addEventListener('click', () => {
        onThumbnailClick(item);
    });

    // 設定 Leaflet 彈窗
    const popup = L.popup({ offset: [0, -40], closeButton: false })
        .setLatLng([item.geoJson.features[0].geometry.coordinates[1], item.geoJson.features[0].geometry.coordinates[0]])
        .setContent(popupContent)
        .openOn(AppState.map);
}
function addRoute(feature, item) {
    const coordinates = convertCoordinates(feature.geometry.coordinates);
    
    // 創建路線
    const polyline = L.polyline(coordinates, {
        color: '#1976d2',
        weight: 3,
        opacity: 0.7
    }).addTo(AppState.map);
    
    // 計算路線中點
    const midpointIndex = Math.floor(coordinates.length / 2);
    const midpoint = coordinates[midpointIndex];
    
    // 創建標題
    const titleOverlay = L.marker(midpoint, {
        icon: L.divIcon({
            className: 'marker-title-container',
            html: `<div class="marker-title">${item.title}</div>`,
            iconSize: [120, 30],
            iconAnchor: [60, 30]
        })
    }).addTo(AppState.map);
    
    // 存儲路線和標題引用
    AppState.routes.push(polyline);
    AppState.markers.push(titleOverlay);
    
    // 事件處理
    const elements = { polyline, titleOverlay };
    const styles = {
        normal: { color: '#1976d2', weight: 3 },
        highlight: { color: '#fbc02d', weight: 5 }
    };

    const clickHandler = (e) => {
        e.originalEvent.stopPropagation(); // 防止觸發地圖的點擊事件
        clearHighlight();
        AppState.currentHighlight = { elements, styles };
        titleOverlay._icon.classList.add('highlight');
        polyline.setStyle(styles.highlight);

      // 設定地圖視角，放大至 15 級（可根據需求調整）
      AppState.map.flyTo(e.latlng, 13, { duration: 0.5 });
        // 顯示簡易資訊
        showSimpleInfoPopupAt(e.latlng, item, (clickedItem) => {
            showLocationDetails(clickedItem);
        });
          // 顯示懸浮按鈕
    document.getElementById('resetViewBtn').style.display = 'block';
    };
    
    const highlightHandler = () => {
        if (!AppState.currentHighlight) {
            titleOverlay._icon.classList.add('highlight');
            polyline.setStyle(styles.highlight);
        }
    };
    
    const unhighlightHandler = () => {
        if (!AppState.currentHighlight) {
            titleOverlay._icon.classList.remove('highlight');
            polyline.setStyle(styles.normal);
        }
    };
    
    // 綁定事件
    polyline.on({
        'click': clickHandler,
        'mouseover': highlightHandler,
        'mouseout': unhighlightHandler
    });
    
    titleOverlay.on({
        'click': clickHandler,
        'mouseover': highlightHandler,
        'mouseout': unhighlightHandler
    });
}

function showSimpleInfoPopupAt(latlng, item, onThumbnailClick) {
    const popupContent = document.createElement('div');
    popupContent.classList.add('simple-info-popup');
    popupContent.innerHTML = `
        <img src="${item.thumbnail}" alt="${item.title}" class="info-thumbnail">
        <div class="info-title">${item.title}</div>
        <div class="info-address">${item.address || '地址未知'}</div>
    `;

    // 點擊縮圖後顯示詳細資訊
    popupContent.querySelector('.info-thumbnail').addEventListener('click', () => {
        onThumbnailClick(item);
    });

    // 設定 Leaflet 彈窗，並將它放在 `latlng`
    const popup = L.popup({ offset: [0, -40], closeButton: false })
        .setLatLng(latlng) // 這裡使用 `latlng`，確保點擊的地方顯示彈窗
        .setContent(popupContent)
        .openOn(AppState.map);
}



// 重置地圖視圖
function resetMapView() {
    const bounds = L.latLngBounds(AppState.markers.map(marker => marker.getLatLng()));
    AppState.map.fitBounds(bounds, { padding: [50, 50] });
}

// 清除地圖特徵
function clearMapFeatures() {
    AppState.markers.forEach(marker => marker.remove());
    AppState.routes.forEach(route => route.remove());
    AppState.markers = [];
    AppState.routes = [];
}

// 地圖功能初始化
document.addEventListener('DOMContentLoaded', initMap);


// 設定預設縮放等級（請根據實際情況調整）
const DEFAULT_ZOOM = 11;
let lastLatLng = null;

// 監聽懸浮按鈕點擊，恢復原本縮放大小
document.getElementById('resetViewBtn').addEventListener('click', () => {
    if (lastLatLng) {
        AppState.map.flyTo(lastLatLng, DEFAULT_ZOOM, { duration: 0.5 });
    }
    document.getElementById('resetViewBtn').style.display = 'none'; // 隱藏按鈕
});