// 收集所有標籤
const allTags = [...new Set(data.flatMap(item => 
    item.tags.map(tag => tag.name)
))];

for (let i = allTags.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allTags[i], allTags[j]] = [allTags[j], allTags[i]];
}
const selectedTags = new Set();

// 渲染標籤按鈕
function renderTagButtons() {
    const container = document.getElementById('tagButtons');
    container.innerHTML = '';

    allTags.forEach(tag => {
        const button = document.createElement('button');
        button.className = `tag-button ${selectedTags.has(tag) ? 'active' : ''}`;
        button.textContent = tag;
        button.onclick = () => {
            if (selectedTags.has(tag)) {
                selectedTags.delete(tag);
            } else {
                selectedTags.add(tag);
            }
            updateSelectedTagsDisplay();
            button.classList.toggle('active');
            handleSearch();
        };
        container.appendChild(button);
    });
}

// 更新標籤按鈕狀態
function updateTagButtons() {
    const tagButtons = document.querySelectorAll('.tag-button');
    tagButtons.forEach(button => {
        if (selectedTags.has(button.textContent)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// 更新已選擇的標籤顯示
function updateSelectedTagsDisplay() {
    const selectedTagsContainer = document.getElementById('selectedTags');
    const defaultText = document.querySelector('.default-text');
    selectedTagsContainer.innerHTML = '';

    if (selectedTags.size === 0) {
        defaultText.style.display = 'inline';
    } else {
        defaultText.style.display = 'none';
        selectedTags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'selected-tag';
            tagElement.innerHTML = `
                ${tag}
                <span class="remove" onclick="event.stopPropagation(); removeTag('${tag}')">×</span>
            `;
            selectedTagsContainer.appendChild(tagElement);
        });
    }
}

// 移除標籤
function removeTag(tag) {
    selectedTags.delete(tag);
    updateSelectedTagsDisplay();
    updateTagButtons();
    handleSearch();
}

// 初始化地圖
const map = L.map('map', {
    zoomControl: false
}).setView([24.5703745, 120.7099826], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 定義不同等級的樣式
const levelStyles = {
    5: {
        color: '#fbc02d',
        markerColor: 'gold',
        borderWidth: '4px'
    },
    4: {
        color: '#9E9E9E',
        markerColor: 'gray',
        borderWidth: '3px'
    },
    3: {
        color: '#CD7F32',
        markerColor: 'orange',
        borderWidth: '2px'
    },
    2: {
        color: '#2196F3',
        markerColor: 'blue',
        borderWidth: '2px'
    },
    1: {
        color: '#4CAF50',
        markerColor: 'green',
        borderWidth: '2px'
    }
};

// 添加地圖標記和綁定事件
const markers = {};
const markerClusterGroup = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 18,
    maxClusterRadius: 40,
    animate: true,
    animateAddingMarkers: false
});// Define line styles based on level
const lineStyles = {
    5: { color: '#fbc02d', weight: 4, opacity: 0.8 },
    4: { color: '#9E9E9E', weight: 3, opacity: 0.8 },
    3: { color: '#CD7F32', weight: 2, opacity: 0.8 },
    2: { color: '#2196F3', weight: 2, opacity: 0.8 },
    1: { color: '#4CAF50', weight: 2, opacity: 0.8 }
};

data.forEach(item => {
    if (item.geoJson && item.geoJson.features) {
        item.geoJson.features.forEach(feature => {
            // Validate the feature has geometry and coordinates
            if (!feature.geometry || !feature.geometry.coordinates) {
                console.warn('Invalid feature geometry:', feature);
                return;
            }

            if (feature.geometry.type === 'Point') {
                // Existing Point handling code
                const coordinates = feature.geometry.coordinates;
                
                if (!Array.isArray(coordinates) || coordinates.length < 2 || 
                    !isFinite(coordinates[0]) || !isFinite(coordinates[1])) {
                    console.warn('Invalid coordinates:', coordinates);
                    return;
                }

                const [lng, lat] = coordinates;

                if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                    console.warn('Coordinates out of range:', { lat, lng });
                    return;
                }

                const levelStyle = levelStyles[item.level] || levelStyles[1];
                const markerIcon = L.divIcon({
                    className: `custom-marker level-${item.level}`,
                    html: `
                        <div class="marker-container">
                            <div class="marker-label">${item.title}</div>
                            <svg display="block" height="41px" width="27px" viewBox="0 0 27 41" style="fill: ${levelStyle.color}">
                                <path d="M27,13.5C27,19.07 20.25,27 14.75,34.5C14.02,35.5 12.98,35.5 12.25,34.5C6.75,27 0,19.22 0,13.5C0,6.04 6.04,0 13.5,0C20.96,0 27,6.04 27,13.5Z"></path>
                                <path opacity="0.25" d="M13.5,0C6.04,0 0,6.04 0,13.5C0,19.22 6.75,27 12.25,34.5C13,35.52 14.02,35.5 14.75,34.5C20.25,27 27,19.07 27,13.5C27,6.04 20.96,0 13.5,0ZM13.5,1C20.42,1 26,6.58 26,13.5C26,15.9 24.5,19.18 22.22,22.74C19.95,26.3 16.71,30.14 13.94,33.91C13.74,34.18 13.61,34.32 13.5,34.44C13.39,34.32 13.26,34.18 13.06,33.91C10.28,30.13 7.41,26.31 5.02,22.77C2.62,19.23 1,15.95 1,13.5C1,6.58 6.58,1 13.5,1Z"></path>
                                <circle fill="white" cx="13.5" cy="13.5" r="5.5"></circle>
                            </svg>
                        </div>`,
                    iconSize: [30, 41],
                    iconAnchor: [15, 41],
                    popupAnchor: [0, -34]
                });

                try {
                    const marker = L.marker([lat, lng], {
                        icon: markerIcon
                    });

                    // ... rest of the marker code ...
                    const imageUrl = item.images && item.images.length > 0 ? item.images[0].url : '';
                    const googleMapUrl = item.googleUrls && item.googleUrls.length > 0 ? item.googleUrls[0].url : '';
                    const address = item.googleUrls && item.googleUrls.length > 0 ? item.googleUrls[0].addrName : '';

                    const popupContent = `
                        <div class="map-popup level-${item.level}" style="cursor: pointer;" onclick="highlightCard('${item.uid}')">
                            ${imageUrl ? `<img src="${imageUrl}" alt="${item.title}">` : ''}
                            <h3>${item.title}</h3>
                            <p>${address}</p>
                            ${item.level === 5 ? '<div class="level-badge">⭐ 推薦</div>' : ''}
                        </div>
                    `;

                    const popup = L.popup({
                        closeButton: true,
                        className: `custom-popup level-${item.level}`,
                        autoPan: false
                    }).setContent(popupContent);

                    marker.bindPopup(popup);
                    markers[item.uid] = marker;
                    markerClusterGroup.addLayer(marker);
                } catch (error) {
                    console.error('Error creating marker:', { lat, lng }, error);
                }
            } else if (feature.geometry.type === 'LineString') {
                // Handle LineString geometry
                const coordinates = feature.geometry.coordinates;
                
                // Validate coordinates array
                if (!Array.isArray(coordinates) || coordinates.length < 2) {
                    console.warn('Invalid LineString coordinates:', coordinates);
                    return;
                }

                // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
                const latLngs = coordinates.map(coord => {
                    if (!Array.isArray(coord) || coord.length < 2 || 
                        !isFinite(coord[0]) || !isFinite(coord[1])) {
                        console.warn('Invalid coordinate in LineString:', coord);
                        return null;
                    }
                    return [coord[1], coord[0]]; // Convert [lng, lat] to [lat, lng]
                }).filter(coord => coord !== null);

                if (latLngs.length < 2) {
                    console.warn('Not enough valid coordinates for LineString');
                    return;
                }

                try {
                    // Create polyline with style based on level
                    const lineStyle = lineStyles[item.level] || lineStyles[1];
                    const polyline = L.polyline(latLngs, lineStyle);
                    const imageUrl = item.images && item.images.length > 0 ? item.images[0].url : '';

                    // Add popup to the polyline
                    const popupContent = `
                    <div class="map-popup level-${item.level}" style="cursor: pointer;" onclick="highlightCard('${item.uid}')">
                        ${imageUrl ? `<img src="${imageUrl}" alt="${item.title}">` : ''}
                        <h3>${item.title}</h3>
                        ${item.level === 5 ? '<div class="level-badge">⭐ 推薦</div>' : ''}
                    </div>
                `;

                    const popup = L.popup({
                        closeButton: true,
                        className: `custom-popup level-${item.level}`,
                        autoPan: false
                    }).setContent(popupContent);

                    polyline.bindPopup(popup);

                    // Store the polyline reference and add it to the map
                    markers[item.uid] = polyline;
                    polyline.addTo(map);

                } catch (error) {
                    console.error('Error creating polyline:', error);
                }
            }
        });
    }
});
map.addLayer(markerClusterGroup);

// 高亮顯示對應的卡片
window.highlightCard = function(itemId) {
    const cards = document.querySelectorAll('.card');
    const targetCard = Array.from(cards).find(card => card.getAttribute('data-id') === itemId);

    if (targetCard) {
        cards.forEach(card => card.classList.remove('highlight'));
        targetCard.classList.add('highlight');
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.add('active');
        }
    }
};

window.highlightCard2 = function(itemId) {
    const cards = document.querySelectorAll('.card');
    const targetCard = Array.from(cards).find(card => card.getAttribute('data-id') === itemId);

    if (targetCard) {
        cards.forEach(card => card.classList.remove('highlight'));
        targetCard.classList.add('highlight');
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

// 渲染資訊卡
function renderCards(filteredData = data) {
    const cardsContainer = document.getElementById('cards');
    cardsContainer.innerHTML = '';

    filteredData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-level', item.level);
        card.setAttribute('data-id', item.uid);

        card.onclick = (event) => {
            const isClickableArea =
                event.target.matches('img') ||
                event.target.matches('h3') ||
                (!event.target.closest('a') && !event.target.closest('.tags'));

            if (isClickableArea) {
                const marker = markers[item.uid];
                if (marker) {
                    map.flyTo(marker.getLatLng(), 18, {
                        duration: 0.5,
                        animate: true
                    });
                    marker.openPopup();
                }
                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('active');
                }
            }
            highlightCard2(item.uid);
        };

        // Get the first image URL if available
        const imageUrl = item.images && item.images.length > 0 ? item.images[0].url : '';

        // Get social media links
        const socialLinks = item.socialUrls ? item.socialUrls.reduce((acc, url) => {
            // 处理 YouTube 链接
            if (url.type === 'youtube' || url.type === 'shorts') {
                acc.push(`
                    <a href="${url.url}" target="_blank" class="social-link youtube">
                        <i class="fab fa-youtube"></i>
                    </a>
                `);
            }
            // 处理 Instagram 链接
            if (url.type === 'instagram' || url.type === 'intagram') {
                acc.push(`
                    <a href="${url.url}" target="_blank" class="social-link instagram">
                        <i class="fab fa-instagram"></i>
                    </a>
                `);
            }
            return acc;
        }, []) : [];

        // Get Google Maps links
        const googleMapLinks = item.googleUrls ? item.googleUrls.reduce((acc, url) => {
            const displayText = url.title ? url.title : url.addrName;
            acc.push(`
                <a href="${url.url}" target="_blank" class="address">
                    <i class="fas fa-map-marker-alt"></i>
                    ${displayText}
                </a>
            `);
            return acc;
        }, []) : [];

        card.innerHTML = `
            <div class="card-header">
                ${imageUrl ? `<img src="${imageUrl}" alt="${item.title}">` : ''}
                <div class="card-social">
                    ${socialLinks.join('')}
                </div>
            </div>
            <div class="card-content">
                <h3>${item.title}</h3>
                ${item.remember ? `<p class="remember">${item.remember}</p>` : ''}
                <div style="display: flex;flex-wrap: wrap;">
                    ${googleMapLinks.join('')}
                </div>
                <div class="tags">
                    ${item.tags.map(tag => `
                        <span class="tag">${tag.name}</span>
                    `).join('')}
                </div>
            </div>
        `;

        cardsContainer.appendChild(card);
    });
}

// 搜尋功能
function handleSearch() {
    const searchText = document.getElementById('searchText').value.toLowerCase();

    const filteredData = data.filter(item => {
        const textMatch =
            item.title.toLowerCase().includes(searchText) ||
            (item.googleUrls && item.googleUrls.some(url => url.addrName.toLowerCase().includes(searchText)));

        const tagMatch = selectedTags.size === 0 ||
            item.tags.some(tag => selectedTags.has(tag.name));

        return textMatch && tagMatch;
    });

    renderCards(filteredData);

    Object.entries(markers).forEach(([id, marker]) => {
        const isVisible = filteredData.some(item => item.uid === id);
        if (isVisible) {
            markerClusterGroup.addLayer(marker);
        } else {
            markerClusterGroup.removeLayer(marker);
        }
    });
}

// Initialize the rest of the event listeners and functionality
document.getElementById('searchText').addEventListener('input', handleSearch);
document.getElementById('toggleSidebar').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
});

// Tag modal events
document.getElementById('tagSearchButton').onclick = () => {
    document.getElementById('tagModal').classList.add('active');
};

document.querySelector('.tag-modal-close').onclick = () => {
    document.getElementById('tagModal').classList.remove('active');
};

document.getElementById('tagModal').onclick = (e) => {
    if (e.target === document.getElementById('tagModal')) {
        document.getElementById('tagModal').classList.remove('active');
    }
};

// Initialize
renderTagButtons();
updateSelectedTagsDisplay();
renderCards();

// Search clear button functionality
const searchInput = document.getElementById('searchText');
const clearButton = document.getElementById('clearSearch');

// Control clear button visibility based on input
searchInput.addEventListener('input', () => {
    clearButton.classList.toggle('visible', searchInput.value.length > 0);
});

// Clear button click event
clearButton.addEventListener('click', () => {
    searchInput.value = '';
    clearButton.classList.remove('visible');
    handleSearch();
    searchInput.focus();
});

// Custom location control
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

// Add location button to map
new L.Control.LocationButton().addTo(map);

// Modal functionality
function openModal() {
    const modal = document.getElementById('titleModal');
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('titleModal');
    modal.classList.remove('active');
}

document.querySelector('.close-modal').addEventListener('click', closeModal);

document.getElementById('titleModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeModal();
    }
});

// Mobile scroll handling
let lastScrollTop = 0;
let isSearchVisible = true;
const searchArea = document.getElementById('search');
const cardsContainer = document.getElementById('cards');

const SCROLL_THRESHOLD = 25;

cardsContainer.addEventListener('scroll', () => {
    if (window.innerWidth > 768) return;

    const currentScroll = cardsContainer.scrollTop;
    const scrollDifference = currentScroll - lastScrollTop;

    if (scrollDifference < -SCROLL_THRESHOLD) {
        if (!isSearchVisible) {
            searchArea.classList.remove('hide');
            searchArea.classList.add('show');
            isSearchVisible = true;
        }
    } else if (scrollDifference > SCROLL_THRESHOLD) {
        if (isSearchVisible && currentScroll > 50) {
            searchArea.classList.add('hide');
            searchArea.classList.remove('show');
            isSearchVisible = false;
        }
    }

    lastScrollTop = currentScroll;
});

// Touch events handling
let touchStartY = 0;
cardsContainer.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

cardsContainer.addEventListener('touchmove', (e) => {
    if (window.innerWidth > 768) return;

    const touchCurrentY = e.touches[0].clientY;
    const touchDifference = touchCurrentY - touchStartY;

    if (touchDifference > 50 && !isSearchVisible) {
        searchArea.classList.remove('hide');
        searchArea.classList.add('show');
        isSearchVisible = true;
    } else if (touchDifference < -50 && isSearchVisible && cardsContainer.scrollTop > 50) {
        searchArea.classList.add('hide');
        searchArea.classList.remove('show');
        isSearchVisible = false;
    }
});

// Window resize handling
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        searchArea.classList.remove('hide', 'show');
        isSearchVisible = true;
    }
});