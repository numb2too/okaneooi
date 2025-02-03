const routes = [
    { 
        id: 'route1', 
        name: '都市綠廊路線', 
        url: './routes/route1.geojson',
        youtube: 'https://youtu.be/example1',
        attractions: ['都市公園', '綠色走廊']
    },
    { 
        id: 'route2', 
        name: '河岸風光路線', 
        url: './routes/route2.geojson',
        youtube: 'https://youtu.be/example2',
        attractions: ['河濱公園', '自行車道']
    }
];

async function loadRoutes() {
    const routePromises = routes.map(async (route) => {
        const response = await fetch(route.url);
        const geoJson = await response.json();
        return { ...route, geoJson };
    });
    
    return Promise.all(routePromises);
}