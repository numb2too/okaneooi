// 初始化模態框功能
function initModals() {
    // 初始化所有模態框的關閉功能
    document.querySelectorAll('.modal').forEach(modal => {
        const closeBtn = modal.querySelector('.close-btn');
        
        // 關閉按鈕點擊事件
        closeBtn.onclick = () => closeModal(modal);
        
        // 點擊背景關閉
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        };
    });
}

// 顯示指定的模態框
function showModal(modal) {
    modal.classList.add('active');
    // 禁止背景滾動
    document.body.style.overflow = 'hidden';
}

// 關閉模態框
function closeModal(modal) {
    modal.classList.remove('active');
    // 恢復背景滾動
    document.body.style.overflow = '';
}

// 顯示位置詳細資訊
function showLocationDetails(item) {
    const modal = document.getElementById('detail-modal');
    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = '';
    modalBody.appendChild(createDetailContent(item));
    showModal(modal);
}

// 創建詳細內容
function createDetailContent(item) {
    const content = document.createElement('div');
    content.className = 'detail-content';

    // 添加標題
    const title = document.createElement('h2');
    title.textContent = item.title;
    content.appendChild(title);

    // 添加預覽圖片
    if (item.images && item.images.length > 0) {
        const imagesContainer = document.createElement('div');
        imagesContainer.className = 'images-container';
        
        item.images.forEach(image => {
            if (image.type === 'pic') {
                const img = document.createElement('img');
                img.src = image.url;
                img.className = 'preview-image';
                img.alt = item.title;
                imagesContainer.appendChild(img);
            }
        });
        
        content.appendChild(imagesContainer);
    }

    // 添加類型圖示
    const typeSpan = document.createElement('span');
    typeSpan.className = 'type-icon';
    typeSpan.textContent = locationIcons[item.type] || '📍';
    content.appendChild(typeSpan);

    // 添加描述
    if (item.remember) {
        const desc = document.createElement('p');
        desc.textContent = item.remember;
        content.appendChild(desc);
    }

    // 添加地址和 Google Maps 連結
    if (item.googleUrls && item.googleUrls.length > 0) {
        const addressDiv = document.createElement('div');
        addressDiv.className = 'address-section';
        
        item.googleUrls.forEach(url => {
            const addressLink = document.createElement('a');
            addressLink.href = url.url;
            addressLink.target = '_blank';
            addressLink.className = 'google-maps-link';
            addressLink.innerHTML = `📍 ${url.addrName || '在 Google Maps 中查看'}`;
            addressDiv.appendChild(addressLink);
        });
        
        content.appendChild(addressDiv);
    }

    // 添加標籤
    if (item.tags && item.tags.length > 0) {
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'tags-section';
        
        item.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            tagSpan.textContent = tag.name;
            tagsDiv.appendChild(tagSpan);
        });
        
        content.appendChild(tagsDiv);
    }

    // 添加評分
    if (item.level !== undefined) {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'level';
        levelDiv.textContent = '⭐'.repeat(item.level);
        content.appendChild(levelDiv);
    }

    // 添加社群媒體連結和嵌入內容
    if (item.socialUrls && item.socialUrls.length > 0) {
        const socialSection = document.createElement('div');
        socialSection.className = 'social-section';

        // 社群媒體連結
        const linksDiv = document.createElement('div');
        linksDiv.className = 'social-links';

        item.socialUrls.forEach(social => {
            // 創建連結
            const link = document.createElement('a');
            link.href = social.url;
            link.target = '_blank';
            link.className = `social-btn ${social.type}`;
            link.textContent = `${socialIcons[social.type] || '🔗'} ${
                social.type === 'youtube' ? 'YouTube' :
                social.type === 'shorts' ? 'Shorts' :
                social.type === 'instagram' ? 'Instagram' : 'Link'
            }`;
            linksDiv.appendChild(link);

            // 如果是 YouTube 影片，添加嵌入播放器
            if (social.type === 'youtube' || social.type === 'shorts') {
                const videoId = getYouTubeVideoId(social.url);
                if (videoId) {
                    const videoContainer = document.createElement('div');
                    videoContainer.className = 'video-container';
                    videoContainer.innerHTML = `
                        <iframe 
                            src="https://www.youtube.com/embed/${videoId}" 
                            title="YouTube video player" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>`;
                    socialSection.appendChild(videoContainer);
                }
            }
        });

        socialSection.appendChild(linksDiv);
        content.appendChild(socialSection);
    }

    // 添加建立時間
    const timeDiv = document.createElement('div');
    timeDiv.className = 'create-time';
    timeDiv.textContent = `建立時間：${formatDate(item.createTime)}`;
    content.appendChild(timeDiv);

    return content;
}

// 初始化模態框功能
document.addEventListener('DOMContentLoaded', initModals);