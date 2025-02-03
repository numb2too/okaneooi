let map, loadedRoutes = [];

function initMap() {
    map = L.map('map').setView([25.0330, 121.5654], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}

async function renderRoutes() {
    loadedRoutes = await loadRoutes();
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    loadedRoutes.forEach(route => {
        const routeLayer = L.geoJSON(route.geoJson, {
            style: { color: 'blue', weight: 5 }
        }).addTo(map);

        const resultDiv = document.createElement('div');
        resultDiv.className = 'route-result';
        resultDiv.innerHTML = `
            <strong>${route.name}</strong>
            <p>${route.attractions.join(', ')}</p>
            <a href="${route.youtube}" target="_blank">路線影片</a>
        `;

        resultDiv.onclick = () => {
            map.fitBounds(routeLayer.getBounds());
            window.open(route.youtube, '_blank');
        };

        searchResults.appendChild(resultDiv);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    renderRoutes();

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.route-result').forEach(result => {
            const visible = result.textContent.toLowerCase().includes(searchTerm);
            result.style.display = visible ? 'block' : 'none';
        });
    });
});