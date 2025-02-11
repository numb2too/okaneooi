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

    // 添加標題
    const title = document.createElement('h3');
    title.textContent = item.title;
    title.onclick = () => showLocationDetails(item);
    content.appendChild(title);

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

// 初始化資訊卡功能
document.addEventListener('DOMContentLoaded', initCardView);