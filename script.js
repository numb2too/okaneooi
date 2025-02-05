
// 初始化地圖
const map = L.map('map').setView([24.565, 120.815], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 地圖圖層管理
const layerGroups = {};
const routeLayers = {};

// 修改 loadGeoJSON 函數
async function loadGeoJSON(route) {
    try {
        const data = route.geoJson;

        let firstLayer = null; // 用來存儲第一個特徵的圖層引用

        const layer = L.geoJSON(data, {
            style: {
                weight: 5,
                opacity: 0.7
            },
            onEachFeature: (feature, layer) => {
                // 存儲第一個特徵的圖層引用
                if (!firstLayer) {
                    firstLayer = layer;
                }

                let popupContent = `
                    <strong>${route.name}</strong>`;

                if (route.type === 'route') {
                    popupContent += `<br>
                        <button onclick="handleKMLDownload('${route.id}', '${route.name}')" 
                                style="margin-top: 10px; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            下載 KML
                        </button>`;
                }

                // 添加 Google Maps 連結（如果存在）
                if (route.googleMapUrl && route.googleMapUrl.length > 0) {
                    popupContent += '<br><div style="margin-top: 8px;">';
                    route.googleMapUrl.forEach(link => {
                        popupContent += `
                    <a href="${link.url}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       style="display: inline-block; margin: 2px 5px; padding: 3px 8px; 
                              background-color: #4CAF50; color: white; 
                              text-decoration: none; border-radius: 4px; 
                              font-size: 12px;">
                        ${link.title} <span style="font-size: 10px;">↗</span>
                    </a>`;
                    });
                    popupContent += '</div>';
                }

                layer.bindPopup(popupContent);
            }
        });

        // 儲存圖層引用和第一個特徵的圖層引用
        routeLayers[route.id] = {
            layer: layer,
            firstLayer: firstLayer
        };

        if (!layerGroups[route.type]) {
            layerGroups[route.type] = L.layerGroup().addTo(map);
        }
        layer.addTo(layerGroups[route.type]);

        const bounds = layer.getBounds();
        map.fitBounds(bounds, { padding: [50, 50] });
    } catch (error) {
        console.error('Error loading GeoJSON:', error);
    }
}

// 生成隨機顏色
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// 轉換 YouTube URL 為嵌入連結
function getYouTubeEmbedUrl(url) {
    const videoId = url.split('v=')[1] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
}

// 渲染路線列表
function renderRouteList(filteredRoutes = routes) {
    const routeList = document.getElementById('routeList');
    routeList.innerHTML = '';

    filteredRoutes.forEach((route, routeIndex) => {
        const routeElement = document.createElement('div');
        routeElement.className = 'route-item';

        // 創建 YouTube 按鈕
        const videoButtons = route.videos.map((video, index) => `
<button 
    onclick="toggleMedia(event, ${routeIndex}, ${index}, 'video')"
    class="video-button"
    style="display: inline-block; margin: 2px 5px; padding: 3px 8px; 
           background-color: #4CAF50; color: white; 
           border: none; text-decoration: none; border-radius: 4px; 
           font-size: 12px; cursor: pointer;">
    YouTube ${index + 1} <span style="font-size: 10px;">▾</span>
</button>
        `).join('');

        // 創建 Instagram 按鈕
        const instagramButtons = route.instagram ? route.instagram.map((igUrl, index) => `
          <button 
    onclick="toggleMedia(event, ${routeIndex}, ${index}, 'instagram')"
    class="instagram-button"
    style="display: inline-block; margin: 2px 5px; padding: 3px 8px; 
           background-color: #E4405F; color: white; 
           border: none; text-decoration: none; border-radius: 4px; 
           font-size: 12px; cursor: pointer;">
    Instagram ${index + 1} <span style="font-size: 10px;">▾</span>
</button>
        `).join('') : '';

        // 創建影片容器
        const videoContainers = route.videos.map((video, index) => `
            <div id="video-${routeIndex}-${index}" 
                 class="video-container"
                 style="display: none; margin-top: 10px;">
                <iframe 
                    src="${getYouTubeEmbedUrl(video)}" 
                    frameborder="0" 
                    style="width: 100%; aspect-ratio: 16/9;"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        `).join('');

        // 創建 Instagram 容器
        const instagramContainers = route.instagram ? route.instagram.map((igUrl, index) => `
            <div id="instagram-${routeIndex}-${index}" 
                 class="instagram-container"
                 style="display: none; margin-top: 10px;">
                <iframe 
                    src="https://www.instagram.com/p/${igUrl.split('/p/')[1].replace('/', '')}/embed" 
                    frameborder="0" 
                    style="width: 100%; aspect-ratio: 1/1;" 
                    allowtransparency="true">
                </iframe>
            </div>
        `).join('') : '';

        routeElement.innerHTML = `
            <div class="route-name">${route.name}</div>
            <div class="tags">
                ${route.attractions.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="media-buttons" style="margin-top: 10px;">
                ${videoButtons}
                ${instagramButtons}
            </div>
            <div class="media-containers">
                ${videoContainers}
                ${instagramContainers}
            </div>
        `;

        // 點擊路線項目時聚焦到對應的地圖位置
        routeElement.addEventListener('click', (e) => {
            if (!e.target.classList.contains('video-button') &&
                !e.target.classList.contains('instagram-button') &&
                !e.target.parentElement.classList.contains('video-button') &&
                !e.target.parentElement.classList.contains('instagram-button')) {
                const layerInfo = routeLayers[route.id];
                if (layerInfo && layerInfo.layer) {
                    map.fitBounds(layerInfo.layer.getBounds());
                    if (layerInfo.firstLayer) {
                        layerInfo.firstLayer.openPopup();
                    }
                }
            }
        });

        routeList.appendChild(routeElement);
    });
}


// 統一的媒體切換函數
window.toggleMedia = function (event, routeIndex, mediaIndex, mediaType) {
    event.stopPropagation();

    const targetContainer = document.getElementById(`${mediaType}-${routeIndex}-${mediaIndex}`);
    const targetButton = event.target.closest(`.${mediaType}-button`);
    const allContainers = document.querySelectorAll('.video-container, .instagram-container');
    const allButtons = document.querySelectorAll('.video-button, .instagram-button');

    const colors = {
        video: {
            default: '#4CAF50',
            active: '#45a049'
        },
        instagram: {
            default: '#E4405F',
            active: '#d63a54'
        }
    };

    if (targetContainer.style.display === 'block') {
        // 關閉當前顯示的內容
        targetContainer.style.display = 'none';
        targetButton.style.backgroundColor = colors[mediaType].default;
        targetButton.querySelector('span').textContent = '▾';
    } else {
        // 關閉所有內容並重置所有按鈕
        allContainers.forEach(container => {
            container.style.display = 'none';
        });
        allButtons.forEach(btn => {
            const type = btn.classList.contains('video-button') ? 'video' : 'instagram';
            btn.style.backgroundColor = colors[type].default;
            btn.querySelector('span').textContent = '▾';
        });

        // 顯示目標內容
        targetContainer.style.display = 'block';
        targetButton.style.backgroundColor = colors[mediaType].active;
        targetButton.querySelector('span').textContent = '▴';
    }
};

// 搜尋功能
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredRoutes = routes.filter(route => {
        return route.name.toLowerCase().includes(searchTerm) ||
            route.attractions.some(tag => tag.toLowerCase().includes(searchTerm));
    });
    renderRouteList(filteredRoutes);
});

// 過濾按鈕功能
document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', () => {
        // 更新按鈕狀態
        document.querySelectorAll('.filter-button').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // 過濾路線
        const type = button.dataset.type;
        const filteredRoutes = type === 'all'
            ? routes
            : routes.filter(route => route.type === type);
        renderRouteList(filteredRoutes);

        // 更新地圖顯示
        Object.entries(layerGroups).forEach(([groupType, group]) => {
            if (type === 'all' || type === groupType) {
                map.addLayer(group);
            } else {
                map.removeLayer(group);
            }
        });
    });
});

// 初始化
routes.forEach(loadGeoJSON);
renderRouteList();

// GeoJSON to KML 轉換函數
function convertToKML(geojson, routeName) {
    // KML 文件開頭
    let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
    <Document>
        <name>${routeName}</name>
        <Style id="lineStyle">
            <LineStyle>
                <color>ff0000ff</color>
                <width>4</width>
            </LineStyle>
        </Style>`;

    // 處理 GeoJSON 特徵
    geojson.features.forEach((feature, index) => {
        kml += `
        <Placemark>
            <name>Path ${index + 1}</name>
            <styleUrl>#lineStyle</styleUrl>
            <LineString>
                <coordinates>`;

        // 對於 LineString
        if (feature.geometry.type === "LineString") {
            feature.geometry.coordinates.forEach(coord => {
                kml += `${coord[0]},${coord[1]},0 `;
            });
        }
        // 對於 MultiLineString
        else if (feature.geometry.type === "MultiLineString") {
            feature.geometry.coordinates.forEach(line => {
                line.forEach(coord => {
                    kml += `${coord[0]},${coord[1]},0 `;
                });
            });
        }

        kml += `</coordinates>
            </LineString>
        </Placemark>`;
    });

    // KML 文件結尾
    kml += `
    </Document>
</kml>`;

    return kml;
}

// 下載功能
function downloadKML(kmlContent, filename) {
    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "屋拎_" + filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// 處理下載事件的函數
window.handleKMLDownload = function (routeId, routeName) {
    const layerInfo = routeLayers[routeId];
    if (layerInfo && layerInfo.layer) {
        const geojson = layerInfo.layer.toGeoJSON();
        const kml = convertToKML(geojson, routeName);
        downloadKML(kml, `${routeName}.kml`);
    }
};



// 創建自定義位置控制按鈕
L.Control.LocationButton = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function(map) {
        this._map = map;
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const button = L.DomUtil.create('a', 'location-button', container);
        
        button.innerHTML = '📍';
        button.href = '#';
        button.title = '定位當前位置';
        button.style.cssText = `
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            font-size: 18px;
            background-color: white;
            display: block;
            border-radius: 4px;
            box-shadow: 0 1px 5px rgba(0,0,0,0.65);
            cursor: pointer;
            text-decoration: none;
        `;

        L.DomEvent.on(button, 'click', this._getCurrentLocation, this);
        L.DomEvent.disableClickPropagation(container);

        this._button = button;
        return container;
    },

    _getCurrentLocation: function(e) {
        e.preventDefault();
        const button = this._button;
        button.innerHTML = '⌛';
        button.style.backgroundColor = '#f0f0f0';

        // 初始化或更新標記
        if (!this._locationMarker) {
            this._locationMarker = L.marker([0, 0], {
                icon: L.divIcon({
                    className: 'current-location-marker',
                    html: '📍',
                    iconSize: [24, 24],
                    iconAnchor: [12, 24]
                })
            }).addTo(this._map);
        }

        // 使用簡單的 getCurrentPosition
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                this._locationMarker.setLatLng([lat, lng]);
                this._map.setView([lat, lng], 16);
                
                button.innerHTML = '📍';
                button.style.backgroundColor = 'white';
            },
            (error) => {
                console.error('Location error:', error);
                alert('無法取得位置資訊，請確認GPS已開啟且已允許位置權限。');
                button.innerHTML = '📍';
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
new L.Control.LocationButton().addTo(map);


// Modal 功能
const title = document.getElementById('title');
const modal = document.getElementById('titleModal');
const closeModal = document.querySelector('.close-modal');

title.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
