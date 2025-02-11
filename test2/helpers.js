// 社群媒體圖示映射
const socialIcons = {
    youtube: '📺',
    shorts: '📱',
    instagram: '📸',
    link: '🔗'
};

// 地點類型圖示映射
const locationIcons = {
    food: '🍽️',
    view: '🏰',
    bike: '🚲'
};

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 安全地取得物件屬性
function safeGet(obj, path, defaultValue = '') {
    try {
        return path.split('.').reduce((acc, part) => acc[part], obj) || defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

// 檢查圖片 URL 是否有效
async function isValidImageUrl(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (e) {
        return false;
    }
}

// 防抖函數
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 將座標轉換為地圖可用格式
function convertCoordinates(coordinates) {
    return coordinates.map(coord => [coord[1], coord[0]]);
}

// KML 生成功能
function generateKML(item) {
    if (!item.geoJson || !item.geoJson.features) return null;
    
    const feature = item.geoJson.features[0];
    if (!feature || !feature.geometry || feature.geometry.type !== 'LineString') return null;

    const coordinates = feature.geometry.coordinates;
    const kmlCoordinates = coordinates
        .map(coord => `${coord[0]},${coord[1]},0`)
        .join(' ');

    const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
    <Document>
        <name>${item.title}</name>
        <description>${item.title} 路線</description>
        <Style id="routeStyle">
            <LineStyle>
                <color>ff0000ff</color>
                <width>4</width>
            </LineStyle>
        </Style>
        <Placemark>
            <name>${item.title}</name>
            <styleUrl>#routeStyle</styleUrl>
            <LineString>
                <coordinates>${kmlCoordinates}</coordinates>
            </LineString>
        </Placemark>
    </Document>
</kml>`;

    return kml;
}

// 下載 KML 檔案
function downloadKML(item) {
    const kml = generateKML(item);
    if (!kml) return;

    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title}_route.kml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
