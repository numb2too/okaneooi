// 初始化地圖
function initMap() {
    // 創建地圖實例
    AppState.map = L.map('map', {
        zoomControl: false  // 停用預設的縮放控制
    }).setView([24.3451924, 120.6235944], 11);
    
    // 添加底圖
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(AppState.map);

    // 創建自定義縮放控制並添加到右下角
    L.control.zoom({
        position: 'bottomright'
    }).addTo(AppState.map);

    // 添加所有標記和路線
    addMapFeatures();

    // 添加標題覆蓋層
    addTitleOverlay();
}

// 添加標題覆蓋層
function addTitleOverlay() {
    const titleOverlay = L.control({
        position: 'topleft'
    });

    titleOverlay.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'map-title-overlay');
        div.innerHTML = `
            <div class="map-title">
                <h2>${document.getElementById('mainTitle').textContent}</h2>
            </div>
        `;
        return div;
    };

    titleOverlay.addTo(AppState.map);
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

// 添加標記
function addMarker(feature, item) {
    const [lng, lat] = feature.geometry.coordinates;
    
    // 創建自定義圖標
    const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-content">
                ${locationIcons[item.type] || '📍'}
                <div class="marker-title">${item.title}</div>
              </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    });

    const marker = L.marker([lat, lng], {
        icon: markerIcon
    }).addTo(AppState.map);
    
    // 存儲標記引用
    AppState.markers.push(marker);
    
    // 添加懸停效果
    marker.on('mouseover', function() {
        this._icon.classList.add('marker-hover');
    });
    
    marker.on('mouseout', function() {
        this._icon.classList.remove('marker-hover');
    });
    
    // 添加點擊事件
    marker.on('click', () => {
        AppState.selectedLocation = item;
        showLocationDetails(item);
    });
}

// 添加路線
function addRoute(feature, item) {
    const coordinates = convertCoordinates(feature.geometry.coordinates);
    const polyline = L.polyline(coordinates, {
        color: '#1976d2',
        weight: 3,
        opacity: 0.7
    }).addTo(AppState.map);
    
    // 存儲路線引用
    AppState.routes.push(polyline);
    
    // 添加點擊事件
    polyline.on('click', () => {
        AppState.selectedLocation = item;
        showLocationDetails(item);
    });
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