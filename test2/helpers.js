// YouTube 影片 ID 提取
function getYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

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