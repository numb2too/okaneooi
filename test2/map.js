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

// 定義統一的樣式配置
const HIGHLIGHT_STYLES = {
    normal: {
        route: {
            color: '#1976d2',
            weight: 3,
            opacity: 0.7
        },
        marker: {
            className: ''
        },
        title: {
            className: ''
        }
    },
    highlight: {
        route: {
            color: '#7955e4',
            weight: 5,
            opacity: 0.9
        },
        marker: {
            className: 'highlight'
        },
        title: {
            className: 'highlight'
        }
    }
};



// 更新清除高亮函數
function clearHighlight(e) {
    if (e && e.originalEvent && e.originalEvent.target.classList.contains('marker-title')) {
        return;
    }
    
    if (AppState.currentHighlight) {
        const { elements } = AppState.currentHighlight;
        
        // 清除標題高亮
        if (elements.titleOverlay) {
            elements.titleOverlay._icon.classList.remove('highlight');
        }
        
        // 清除標記高亮
        if (elements.marker) {
            elements.marker._icon.classList.remove('highlight');
        }
        
        // 清除路線高亮
        if (elements.polyline) {
            elements.polyline.setStyle(HIGHLIGHT_STYLES.normal.route);
        }
    }
    AppState.currentHighlight = null;
}


// 統一的高亮處理函數
function applyHighlight(elements, isHighlight) {
    const styles = isHighlight ? HIGHLIGHT_STYLES.highlight : HIGHLIGHT_STYLES.normal;
    
    // 應用標題高亮
    if (elements.titleOverlay) {
        elements.titleOverlay._icon.classList.toggle('highlight', isHighlight);
    }
    
    // 應用標記高亮
    if (elements.marker) {
        elements.marker._icon.classList.toggle('highlight', isHighlight);
    }
    
    // 應用路線高亮
    if (elements.polyline) {
        elements.polyline.setStyle(styles.route);
    }
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
}

// 顯示簡單資訊彈窗
function showSimpleInfoPopup(item, onThumbnailClick) {
    const popupContent = document.createElement('div');
    popupContent.classList.add('simple-info-popup');
    
    // 使用更結構化的 HTML
    popupContent.innerHTML = `
        <div class="popup-container">
            <div class="popup-image-container">
                <img src="${item.images[0].url}" alt="${item.title}" class="info-thumbnail">
                <div class="image-overlay">
                    <span class="click-hint">點擊查看更多</span>
                </div>
            </div>
            <div class="popup-content">
                <h3 class="info-title">${item.title}</h3>
                <div class="info-address">
                    <i class="fas fa-map-marker-alt"></i>
                    ${item.googleUrls[0].addrName || '地址未知'}
                </div>
            </div>
        </div>
    `;

    // 點擊整個圖片容器來顯示詳細資訊
    popupContent.querySelector('.popup-image-container').addEventListener('click', () => {
        onThumbnailClick(item);
    });

    // 設定 Leaflet 彈窗
    const popup = L.popup({
        offset: [0, -40],
        closeButton: false,
        className: 'custom-popup' // 添加自訂類別以便設定樣式
    })
        .setLatLng([
            item.geoJson.features[0].geometry.coordinates[1],
            item.geoJson.features[0].geometry.coordinates[0]
        ])
        .setContent(popupContent)
        .openOn(AppState.map);
}


// 更新添加標記函數
function addMarker(feature, item) {
    const [lng, lat] = feature.geometry.coordinates;
    
    const marker = L.marker([lat, lng]).addTo(AppState.map);
    
    const titleOverlay = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'marker-title-container',
            html: `<div class="marker-title">${item.title}</div>`,
            iconSize: [120, 30],
            iconAnchor: [15, 30]
        })
    }).addTo(AppState.map);
    
    AppState.markers.push(marker);
    AppState.markers.push(titleOverlay);
    
    const elements = { marker, titleOverlay };

    const clickHandler = (e) => {
        e.originalEvent.stopPropagation();
        clearHighlight();
        AppState.currentHighlight = { elements };
        applyHighlight(elements, true);
        
        lastLatLng = e.latlng;
        AppState.map.flyTo(e.latlng, 15, { duration: 0.5 });
        
        showSimpleInfoPopup(item, (clickedItem) => {
            showLocationDetails(clickedItem);
        });
        
        document.getElementById('resetViewBtn').style.display = 'block';
    };
    
    const highlightHandler = () => {
        if (!AppState.currentHighlight) {
            applyHighlight(elements, true);
        }
    };
    
    const unhighlightHandler = () => {
        if (!AppState.currentHighlight) {
            applyHighlight(elements, false);
        }
    };
    
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

// 更新添加路線函數
function addRoute(feature, item) {
    const coordinates = convertCoordinates(feature.geometry.coordinates);
    
    const polyline = L.polyline(coordinates, HIGHLIGHT_STYLES.normal.route).addTo(AppState.map);
    
    const midpointIndex = Math.floor(coordinates.length / 2);
    const midpoint = coordinates[midpointIndex];
    
    const titleOverlay = L.marker(midpoint, {
        icon: L.divIcon({
            className: 'marker-title-container',
            html: `<div class="marker-title">${item.title}</div>`,
            iconSize: [120, 30],
            iconAnchor: [60, 30]
        })
    }).addTo(AppState.map);
    
    AppState.routes.push(polyline);
    AppState.markers.push(titleOverlay);
    
    const elements = { polyline, titleOverlay };

    const clickHandler = (e) => {
        e.originalEvent.stopPropagation();
        clearHighlight();
        AppState.currentHighlight = { elements };
        applyHighlight(elements, true);

        AppState.map.flyTo(e.latlng, 13, { duration: 0.5 });
        showSimpleInfoPopupAt(e.latlng, item, (clickedItem) => {
            showLocationDetails(clickedItem);
        });
        document.getElementById('resetViewBtn').style.display = 'block';
    };
    
    const highlightHandler = () => {
        if (!AppState.currentHighlight) {
            applyHighlight(elements, true);
        }
    };
    
    const unhighlightHandler = () => {
        if (!AppState.currentHighlight) {
            applyHighlight(elements, false);
        }
    };
    
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