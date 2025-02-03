const bikeJsonData = [

    {
        "title": "台中清水-貓",
        "youtubeLink": "https://www.youtube.com/shorts/VFUhHLih1NM",
        "cities": ["台中市"],
        "districts": ["清水區"],
        "routes": ["貓"]
    },
    {
        "title": "台中清水-平交道-火車-寿橋-惠明橋-平交道",
        "youtubeLink": "https://www.youtube.com/shorts/y11bPL1gNmE",
        "cities": ["台中市"],
        "districts": ["清水區"],
        "routes": ["鐵道", "火車"]
    },
    {
        "title": "大安濱海自行車道大安段",
        "youtubeLink": "https://www.youtube.com/shorts/bwNVKGIW4fM",
        "cities": ["台中市"],
        "districts": ["大甲區", "清水區"],
        "routes": ["大安濱海自行車道大安段", "高美濕地"]
    }
];



const geojsonData = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "coordinates": [
                    120.60268143176074,
                    24.412889647480895
                ],
                "type": "Point"
            }, "properties": {
                "name": "清水自行車道",
                "youtube": "https://www.youtube.com/watch?v=VIDEO_2"
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "coordinates": [
                    [
                        120.60348765672671,
                        24.412687317937525
                    ],
                    [
                        120.60190004168464,
                        24.40896982653406
                    ],
                    [
                        120.60593711993664,
                        24.406367517421828
                    ],
                    [
                        120.60974739603927,
                        24.40454999988303
                    ]
                ],
                "type": "LineString"
            }, "properties": {
                "name": "清水自行車道",
                "youtube": "https://www.youtube.com/watch?v=VIDEO_2"
            }
        }
    ]
};