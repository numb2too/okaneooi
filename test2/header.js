// 初始化標題功能
function initHeader() {
    const mainTitle = document.getElementById('mainTitle');
    
    // 點擊標題顯示關於我們
    mainTitle.addEventListener('click', () => {
        const aboutModal = document.getElementById('about-modal');
        showModal(aboutModal);
    });
}

// DOM 載入完成後初始化標題功能
document.addEventListener('DOMContentLoaded', initHeader);