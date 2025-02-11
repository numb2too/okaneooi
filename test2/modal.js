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
        
        // 創建圖片滾動容器
        const imagesScroll = document.createElement('div');
        imagesScroll.className = 'images-scroll';
        
        // 篩選出圖片類型
        const pictures = item.images.filter(image => image.type === 'pic');
        
        pictures.forEach(image => {
            const img = document.createElement('img');
            img.src = image.url;
            img.className = 'preview-image';
            img.alt = item.title;
            imagesScroll.appendChild(img);
        });

        // 只有在有多張圖片時才添加箭頭
        if (pictures.length > 1) {
            // 添加左右箭頭
            const leftArrow = document.createElement('button');
            leftArrow.className = 'scroll-arrow left hidden';
            leftArrow.innerHTML = '&#10094;';
            
            const rightArrow = document.createElement('button');
            rightArrow.className = 'scroll-arrow right';
            rightArrow.innerHTML = '&#10095;';
            
            // 添加滾動事件監聽
            imagesScroll.addEventListener('scroll', () => {
                const isAtStart = imagesScroll.scrollLeft <= 0;
                const isAtEnd = imagesScroll.scrollLeft + imagesScroll.clientWidth >= imagesScroll.scrollWidth;
                
                leftArrow.classList.toggle('hidden', isAtStart);
                rightArrow.classList.toggle('hidden', isAtEnd);
            });
            
            // 添加箭頭點擊事件
            leftArrow.addEventListener('click', () => {
                imagesScroll.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
            });
            
            rightArrow.addEventListener('click', () => {
                imagesScroll.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
            });
            
            imagesContainer.appendChild(leftArrow);
            imagesContainer.appendChild(rightArrow);
        }
        
        imagesContainer.appendChild(imagesScroll);
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
    updateSocialContent(content,item)

    // 添加建立時間
    const timeDiv = document.createElement('div');
    timeDiv.className = 'create-time';
    timeDiv.textContent = `建立時間：${formatDate(item.createTime)}`;
    content.appendChild(timeDiv);

    return content;
}

function updateSocialContent(content,item) {
    if (item.socialUrls && item.socialUrls.length > 0) {
        const socialContent = createSocialSection(item.socialUrls);
        content.appendChild(socialContent);
    }
}

// 創建社群媒體區塊
function createSocialSection(socialUrls) {
    const socialSection = document.createElement('div');
    socialSection.className = 'social-section';

    const videoGrid = document.createElement('div');
    videoGrid.className = 'video-grid';

    const linksDiv = document.createElement('div');
    linksDiv.className = 'social-links';

    socialUrls.forEach(social => {
        if (social.type === 'youtube' || social.type === 'shorts') {
            const videoId = getYouTubeVideoId(social.url);
            if (videoId) {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'video-thumbnail';
                thumbnail.onclick = () => window.open(social.url, '_blank');

                thumbnail.innerHTML = `
                    <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" 
                         onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'"
                         alt="YouTube Thumbnail">
                    <div class="play-icon">▶</div>
                `;
                videoGrid.appendChild(thumbnail);
            }
        } else {
            // 處理其他社群媒體連結
            const link = document.createElement('a');
            link.href = social.url;
            link.target = '_blank';
            link.className = 'social-link';
            
            // 根據類型設置圖標和文字
            const icon = socialIcons[social.type] || '🔗';
            const text = social.title || social.type;
            
            link.innerHTML = `
                <span class="icon">${icon}</span>
                <span>${text}</span>
            `;
            linksDiv.appendChild(link);
        }
    });

    if (videoGrid.children.length > 0) {
        socialSection.appendChild(videoGrid);
    }
    if (linksDiv.children.length > 0) {
        socialSection.appendChild(linksDiv);
    }

    return socialSection;
}

// 獲取 YouTube 影片 ID
function getYouTubeVideoId(url) {
    try {
        const urlObj = new URL(url);
         // 處理 YouTube Shorts 網址
          if (urlObj.pathname.includes('/shorts/')) {
            return urlObj.pathname.split('/shorts/')[1];
        }
        // 處理一般 YouTube 網址
        else if (urlObj.hostname.includes('youtube.com')) {
            const searchParams = new URLSearchParams(urlObj.search);
            return searchParams.get('v');
        }
       
        // 處理 youtu.be 短網址
        else if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }
    } catch (e) {
        console.error('Invalid URL:', url);
    }
    return null;
}

// 初始化模態框功能
document.addEventListener('DOMContentLoaded', initModals);