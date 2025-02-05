 // 資料
 const routes = [
    {
        id: 'route1',
        type: 'route',
        name: '都市綠廊路線11',
        googleMapUrl: [{title:'起點', url:'https://maps.app.goo.gl/VGEoc7KuaRtLiYh1A'}
            ,{title:'終點', url:'https://maps.app.goo.gl/VGEoc7KuaRtLiYh1A'}
        ],
        geoJson:{
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "coordinates": [
                    [
                      120.58220473817516,
                      24.354242997866123
                    ],
                    [
                      120.57641510776142,
                      24.349273952231684
                    ],
                    [
                      120.5715491999834,
                      24.340942446499852
                    ],
                    [
                      120.5700398030661,
                      24.335287176400797
                    ]
                  ],
                  "type": "LineString"
                }
              }
            ]
          },
        videos: ['https://www.youtube.com/shorts/RZBahJYWGJQ'],
        attractions: ['都市公園1', '綠色走廊']
    },
    {
        id: 'route2',
        type: 'route',
        name: '河岸風光路線',
        googleMapUrl: 'https://maps.app.goo.gl/VGEoc7KuaRtLiYh1A',
        videos: ['https://www.youtube.com/shorts/RZBahJYWGJQ'],
        geoJson: {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "coordinates": [
                    [
                      120.60174582809117,
                      24.35806096489472
                    ],
                    [
                      120.59881105099896,
                      24.355310492128382
                    ],
                    [
                      120.59696122722431,
                      24.35225285018703
                    ],
                    [
                      120.5912603502569,
                      24.35171851604308
                    ]
                  ],
                  "type": "LineString"
                }
              }
            ]
          },
          googleMapUrl: [{title:'起點', url:'https://maps.app.goo.gl/VGEoc7KuaRtLiYh1A'}
              ,{title:'終點', url:'https://maps.app.goo.gl/VGEoc7KuaRtLiYh1A'}
          ],
        attractions: ['河濱公園', '自行車道']
    },
    {
        id: 'route3',
        type: 'food',
        name: '苗栗後龍 牛師父牛肉麵',
        googleMapUrl: 'https://maps.app.goo.gl/VGEoc7KuaRtLiYh1A',
        videos: ['https://www.youtube.com/shorts/RZBahJYWGJQ'],
        googleMapUrl: [{title:'餐廳map', url:'https://maps.app.goo.gl/VGEoc7KuaRtLiYh1A'}
        ],
        geoJson: {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "coordinates": [
                    120.57011885138007,
                    24.353404531231845
                  ],
                  "type": "Point"
                }
              }
            ]
          },
        attractions: ['牛肉麵']
    }
];