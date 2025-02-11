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
    addMapFeatures(foodData);

    AppState.filteredData = foodData;



    // 初始化定位按鈕
    initLocationButton();
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
// 修改添加地圖特徵函數
function addMapFeatures(data) {
    // 確保清除所有現有的標記
    clearMapFeatures();

    // 重置 allMapFeatures
    AppState.allMapFeatures = {
        markers: [],
        routes: [],
        titles: []
    };

    data.forEach(item => {
        if (item.geoJson && item.geoJson.features) {
            item.geoJson.features.forEach(feature => {
                if (feature.geometry.type === 'Point') {
                    const mapElements = addMarker(feature, item);
                    AppState.allMapFeatures.markers.push({
                        elements: mapElements,
                        id: item.id
                    });
                } else if (feature.geometry.type === 'LineString') {
                    const mapElements = addRoute(feature, item);
                    AppState.allMapFeatures.routes.push({
                        elements: mapElements,
                        id: item.id
                    });
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
        offset: [0, 0],
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

    // 建立小型標記
    const marker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'custom-marker',
            html: '<div class="marker-dot"></div>',
            iconSize: [16, 16],
            iconAnchor: [4, 4]
        })
    }).addTo(AppState.map);
    const titleOverlay = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'marker-title-container',
            html: `<div class="marker-title">${item.title}</div>`,
            iconSize: [120, 30],
            iconAnchor: [15, 8]
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


    AppState.allMapFeatures.markers.push({ elements, id: item.id });
    return elements;  // 返回創建的元素
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

        lastLatLng = e.latlng;
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


    AppState.allMapFeatures.routes.push({ elements, id: item.id });
    return elements;  // 返回創建的元素
}
function showSimpleInfoPopupAt(latlng, item, onThumbnailClick) {
    const popupContent = document.createElement('div');
    popupContent.classList.add('simple-info-popup');
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

    // 設定 Leaflet 彈窗，並將它放在 `latlng`
    const popup = L.popup({ offset: [0, -16], closeButton: false
        ,
        className: 'custom-popup' // 添加自訂類別以便設定樣式
     })
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
    // 清除所有標記和它們的事件監聽器
    AppState.allMapFeatures.markers.forEach(({ elements }) => {
        if (elements.marker) {
            elements.marker.remove();
            elements.marker.clearAllEventListeners();
        }
        if (elements.titleOverlay) {
            elements.titleOverlay.remove();
            elements.titleOverlay.clearAllEventListeners();
        }
    });

    // 清除所有路線和它們的事件監聽器
    AppState.allMapFeatures.routes.forEach(({ elements }) => {
        if (elements.polyline) {
            elements.polyline.remove();
            elements.polyline.clearAllEventListeners();
        }
        if (elements.titleOverlay) {
            elements.titleOverlay.remove();
            elements.titleOverlay.clearAllEventListeners();
        }
    });

    // 重置數組
    AppState.markers = [];
    AppState.routes = [];
    AppState.allMapFeatures = {
        markers: [],
        routes: [],
        titles: []
    };
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
    document.querySelector('#map').click();
});

// 隨機選擇地標並飛過去
function randomLocation() {
    // 確保有可用的資料
    if (!AppState.filteredData || AppState.filteredData.length === 0) {
        alert('沒有可用的地標資料');
        return;
    }

    // 確保在地圖視圖
    const mapViewButton = document.querySelector('[data-view="map-view"]');
    if (mapViewButton) {
        mapViewButton.click();
    }

    // 新增載入動畫
    const randomViewBtn = document.getElementById('randomViewBtn');
    if (randomViewBtn) {
        randomViewBtn.disabled = true;
        randomViewBtn.innerHTML = '🎲 隨機搜尋中...';
    }

    // 找到有效的地標
    let validItems = AppState.filteredData.filter(item => 
        item.geoJson && 
        item.geoJson.features && 
        item.geoJson.features[0] && 
        item.geoJson.features[0].geometry
    );

    if (validItems.length === 0) {
        alert('沒有有效的地標資料');
        if (randomViewBtn) {
            randomViewBtn.disabled = false;
            randomViewBtn.innerHTML = '🎲';
        }
        return;
    }


    // 如果只有一個有效項目，直接回傳
    if (validItems.length === 1) {
        if (randomViewBtn) {
            randomViewBtn.disabled = false;
            randomViewBtn.innerHTML = '🎲';
        }
        return;
    }

    // 排除當前項目
    if (AppState.currentItemIndex !== undefined && AppState.currentItemIndex >= 0) {
        validItems = validItems.filter((item, index) => index !== AppState.currentItemIndex);
    }

    // 隨機選擇一個地標
    const randomIndex = Math.floor(Math.random() * validItems.length);
    const item = validItems[randomIndex];
    
    // 更新當前索引
    AppState.currentItemIndex = AppState.filteredData.findIndex(i => i === item);

    // 延遲執行以確保地圖視圖已完全載入
    setTimeout(() => {
        flyToLocation(item);

        // 重設按鈕狀態
        if (randomViewBtn) {
            randomViewBtn.disabled = false;
            randomViewBtn.innerHTML = '🎲';
        }
    }, 300);
}

// 監聽隨機查看按鈕點擊事件
document.getElementById('randomViewBtn').addEventListener('click', randomLocation);
// 監聽下一個地圖按鈕點擊事件
document.getElementById('nextViewBtn').addEventListener('click', navigateToNextLocation);
// 監聽重新整理按鈕點擊事件
document.getElementById('refreshBtn').addEventListener('click', refreshPage);

// 新增鍵盤快捷鍵
document.addEventListener('keydown', (event) => {
    // 按空白鍵觸發隨機查看 (確保不是在輸入框中)
    if (event.code === 'Space' && 
        !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        event.preventDefault();
        randomLocation();
    }
});



// 初始化定位按鈕
function initLocationButton() {
    L.Control.LocationButton = L.Control.extend({
        options: {
            position: 'topright'
        },

        onAdd: function (map) {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            const button = L.DomUtil.create('a', 'location-button', container);

            button.innerHTML = '<i class="fas fa-location-arrow"></i>';
            button.href = '#';
            button.title = '定位當前位置';

            const buttonStyles = `
                width: 34px;
                height: 34px;
                line-height: 34px;
                text-align: center;
                font-size: 16px;
                background-color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                cursor: pointer;
                text-decoration: none;
                color: #666;
                transition: all 0.3s ease;
            `;
            button.style.cssText = buttonStyles;

            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#f4f4f4';
            });

            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = 'white';
            });

            L.DomEvent.on(button, 'click', this._getCurrentLocation, this);
            L.DomEvent.disableClickPropagation(container);

            this._button = button;
            this._locationMarker = null;
            this._locationCircle = null;
            this._pulsingDot = null;
            return container;
        },

        _getCurrentLocation: function (e) {
            e.preventDefault();
            const button = this._button;

            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.style.backgroundColor = '#f0f0f0';

            if (!navigator.geolocation) {
                alert('您的瀏覽器不支援地理位置功能');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const accuracy = position.coords.accuracy;

                    // 清除舊的標記
                    if (this._locationMarker) {
                        this._map.removeLayer(this._locationMarker);
                    }
                    if (this._locationCircle) {
                        this._map.removeLayer(this._locationCircle);
                    }
                    if (this._pulsingDot) {
                        this._map.removeLayer(this._pulsingDot);
                    }

                    // 添加位置精確度圓圈
                    this._locationCircle = L.circle([lat, lng], {
                        radius: accuracy,
                        color: '#4A90E2',
                        fillColor: '#4A90E2',
                        fillOpacity: 0.15,
                        weight: 2,
                        opacity: 0.5
                    }).addTo(this._map);

                    // 創建自定義的定位點標記
                    const markerHtml = `
                        <div class="location-marker-container">
                            <div class="location-marker-dot"></div>
                            <div class="location-marker-pulse"></div>
                        </div>
                    `;

                    this._locationMarker = L.marker([lat, lng], {
                        icon: L.divIcon({
                            className: 'location-marker',
                            html: markerHtml,
                            iconSize: [20, 20],
                            iconAnchor: [10, 10]  // 將錨點設在中心
                        })
                    }).addTo(this._map);

                    // 將地圖視角移動到當前位置
                    this._map.setView([lat, lng], 16);

                    // 恢復按鈕狀態
                    button.innerHTML = '<i class="fas fa-location-arrow"></i>';
                    button.style.backgroundColor = 'white';
                },
                (error) => {
                    console.error('Location error:', error);
                    let errorMessage = '無法取得位置資訊。';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += '請確認已允許位置權限。';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += '位置資訊暫時無法使用。';
                            break;
                        case error.TIMEOUT:
                            errorMessage += '請求位置超時。';
                            break;
                        default:
                            errorMessage += '發生未知錯誤。';
                    }
                    alert(errorMessage);

                    button.innerHTML = '<i class="fas fa-location-arrow"></i>';
                    button.style.backgroundColor = 'white';
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        }
    });

    // 添加定位按鈕到地圖
    new L.Control.LocationButton().addTo(AppState.map);
}


// 跳到下一個地標
function navigateToNextLocation() {
    // 確保有可用的資料
    if (!AppState.filteredData || AppState.filteredData.length === 0) {
        console.warn('沒有可用的地標資料');
        return;
    }

    // 確保在地圖視圖
    const mapViewButton = document.querySelector('[data-view="map-view"]');
    if (mapViewButton) {
        mapViewButton.click();
    }

    // 新增載入動畫
    const nextViewBtn = document.getElementById('nextViewBtn');
    if (nextViewBtn) {
        nextViewBtn.disabled = true;
        nextViewBtn.innerHTML = '⏳ 下個地點載入中...';
    }

    // 找到有效的地標
    let validItems = AppState.filteredData.filter(item => 
        item.geoJson && 
        item.geoJson.features && 
        item.geoJson.features[0] && 
        item.geoJson.features[0].geometry
    );

    if (validItems.length === 0) {
        console.warn('沒有有效的地標資料');
        if (nextViewBtn) {
            nextViewBtn.disabled = false;
            nextViewBtn.innerHTML = '➡️';
        }
        return;
    }

    // 計算下一個索引
    AppState.currentItemIndex = (AppState.currentItemIndex + 1) % validItems.length;
    const nextItem = validItems[AppState.currentItemIndex];

    // 延遲執行以確保地圖視圖已完全載入
    setTimeout(() => {
        flyToLocation(nextItem);

        // 重設按鈕狀態
        if (nextViewBtn) {
            nextViewBtn.disabled = false;
            nextViewBtn.innerHTML = '➡️';
        }
    }, 300);
}


// 監聽鍵盤事件
document.addEventListener('keydown', (event) => {
    // 按 N 鍵觸發下一個 (確保不是在輸入框中)
    if (event.key.toLowerCase() === 'n' && 
        !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        event.preventDefault();
        navigateToNextLocation();
    }
});


// 重新整理頁面功能
function refreshPage() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '🔄 重新整理中...';
    }

    // 延遲一下下讓使用者看到按鈕狀態變化
    setTimeout(() => {
        window.location.reload();
    }, 100);
}

// 監聽鍵盤事件
document.addEventListener('keydown', (event) => {
    // 按 R 鍵觸發重新整理 (確保不是在輸入框中)
    if (event.key.toLowerCase() === 'r' && 
        !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        event.preventDefault();
        refreshPage();
    }
});