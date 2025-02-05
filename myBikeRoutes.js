// 資料
const routes = [
  {
    id: '5',
    type: 'food',
    name: 'beard papa泡芙',
    googleMapUrl: [
      { title: 'googleMap', url: 'https://maps.app.goo.gl/MY5bugTiLkysEWvA6' }
    ],
    geoJson: {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              120.5182288131992,
              24.25922581264995,
              4.90341451426344
            ]
          },
          "properties": {
            "name": "beard papa's泡芙",
            "styleUrl": "#__managed_style_0B8F6583DE360A90CF51",
            "fill-opacity": 0.25098039215686274,
            "fill": "#ffffff",
            "stroke-opacity": 1,
            "stroke": "#fbc02d",
            "stroke-width": 2.28571,
            "icon-offset": [
              64,
              128
            ],
            "icon-offset-units": [
              "pixels",
              "insetPixels"
            ],
            "icon": "https://earth.google.com/earth/document/icon?id=2000&scale=4"
          },
          "id": "03B9FE2875360A90CF4A"
        }
      ]
    },
    videos: ['https://youtube.com/shorts/vpZu7u0xmaM?si=jYe5nZ-CRSY9xNUM'
    ],
    instagram: ['https://www.instagram.com/p/DFT4ubYy7Dp'],
    attractions: ['435台中市梧棲區臺灣大道十段168號2樓','美食', '清水', '三井', '泡芙','甜點']
  },
  {
  id: '4',
  type: 'scenery',
  name: '清水看火車',
  googleMapUrl: [
    { title: 'googleMap', url: 'https://maps.app.goo.gl/QnNnQpfmwLeJS34f8' }
  ],
  geoJson: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            120.5720334543153,
            24.27127766707614,
            9.49248626207378
          ]
        },
        "properties": {
          "name": "可以看火車",
          "styleUrl": "#__managed_style_0E9908A43C360A8632C8",
          "fill-opacity": 0.25098039215686274,
          "fill": "#ffffff",
          "stroke-opacity": 1,
          "stroke": "#fbc02d",
          "stroke-width": 2.28571,
          "icon-offset": [
            64,
            128
          ],
          "icon-offset-units": [
            "pixels",
            "insetPixels"
          ],
          "icon": "https://earth.google.com/earth/document/icon?id=2000&scale=4"
        },
        "id": "0D5EF2359D360A8632C2"
      }
    ]
  },
  videos: ['https://youtu.be/wmux6_8Oj2M?si=gxB_UE7bdNCA_UeC'
    , 'https://youtube.com/shorts/y11bPL1gNmE?si=afJt7MGMv2fAy6ui'
  ],
  instagram: [],
  attractions: ['風景', '清水', '壽橋', '火車', '鐵軌']
},
{
  id: '3',
  type: 'food',
  name: '柯江發古早味肉羹',
  googleMapUrl: [
    { title: 'googleMap', url: 'https://maps.app.goo.gl/xBLguLcyAcqZaNQF7' }
  ],
  geoJson: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            120.6207918,
            24.3466819,
            0
          ]
        },
        "properties": {
          "name": "柯江發古早味肉羹（85年老店）",
          "styleUrl": "#__managed_style_0BF44D6823360A4C545E",
          "fill-opacity": 0.25098039215686274,
          "fill": "#ffffff",
          "stroke-opacity": 1,
          "stroke": "#fbc02d",
          "stroke-width": 2.28571,
          "icon-offset": [
            64,
            128
          ],
          "icon-offset-units": [
            "pixels",
            "insetPixels"
          ],
          "icon": "https://earth.google.com/earth/document/icon?color=fbc02d&id=2000&scale=4"
        },
        "id": "071A31C831360A4C5453"
      }
    ]
  },
  videos: ['https://youtube.com/shorts/lGb-awMC6I4?si=lHDxgMCMh34gjNm8'
  ],
  instagram: ['https://www.instagram.com/p/DFpZI61Sko1/'],
  attractions: ['437台中市大甲區蔣公路181-2號','美食', '大甲', '蔣公路', '肉羹湯']
},
{
  id: '2',
  type: 'scenery',
  name: '大甲蔣公路夜市',
  kml:true,
  googleMapUrl: [
    { title: 'googleMap', url: 'https://maps.app.goo.gl/UyECt7amijDntZfz6' }
  ],
  geoJson: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [
              120.6213955925232,
              24.34652474133696,
              0
            ],
            [
              120.6224117052034,
              24.34614855554666,
              0
            ],
            [
              120.6227857855612,
              24.34599202780064,
              0
            ],
            [
              120.6228956963567,
              24.34588463270482,
              0
            ],
            [
              120.6231595026636,
              24.34561880906255,
              0
            ],
            [
              120.6233183119149,
              24.34554345212056,
              0
            ],
            [
              120.6239208776104,
              24.34531813888906,
              0
            ],
            [
              120.6250125587488,
              24.34497349347427,
              0
            ],
            [
              120.6257867274022,
              24.3447637851754,
              0
            ]
          ]
        },
        "properties": {
          "name": "散步路線1",
          "styleUrl": "#__managed_style_072A0DED7E3609FDA2C4",
          "fill-opacity": 0.25098039215686274,
          "fill": "#ffffff",
          "stroke-width": 4.57143,
          "icon-offset": [
            64,
            128
          ],
          "icon-offset-units": [
            "pixels",
            "insetPixels"
          ],
          "icon": "https://earth.google.com/earth/document/icon?color=1976d2&id=2000&scale=4"
        },
        "id": "085AD3C0773609FDA2BE"
      }
    ]
  },
  videos: ['https://youtu.be/wZYowXPG-OA?si=sqC5BkXINIzg_GvR'
  ],
  instagram: [],
  attractions: ['散步','風景', '大甲', '蔣公路夜市', '大甲鎮瀾宮']
},
{
  id: '1',
  type: 'route',
  kml:true,
  name: '自行車路線1-溫寮景觀橋-海角明珠',
  googleMapUrl: [
    { title: '溫寮景觀橋', url: 'https://maps.app.goo.gl/bCny27hFTjZooo5m8' }
    , { title: '海角明珠', url: 'https://maps.app.goo.gl/UZt4KCLcrhB4SoTd7' }
  ],
  geoJson: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [
              120.5841035286034,
              24.37139470941717,
              0
            ],
            [
              120.5836229840057,
              24.3712178731512,
              0
            ],
            [
              120.5830995995714,
              24.37113696278726,
              0
            ],
            [
              120.5819504826877,
              24.37083766265638,
              0
            ],
            [
              120.5817699142628,
              24.37076821722384,
              0
            ],
            [
              120.5817884198291,
              24.37066430551441,
              0
            ],
            [
              120.5818675786913,
              24.37061326121332,
              0
            ],
            [
              120.582225992245,
              24.37045013571664,
              0
            ],
            [
              120.582353836842,
              24.3703504815756,
              0
            ],
            [
              120.5824207795345,
              24.3702617966642,
              0
            ],
            [
              120.5822148409989,
              24.36998369755218,
              0
            ],
            [
              120.5821225540689,
              24.36976866865265,
              0
            ],
            [
              120.5822570079576,
              24.36957744672205,
              0
            ],
            [
              120.5822635000569,
              24.36938893965057,
              0
            ],
            [
              120.5823794966705,
              24.36924725995067,
              0
            ],
            [
              120.5825192593998,
              24.36915377653201,
              0
            ],
            [
              120.583007798177,
              24.36883812781166,
              0
            ],
            [
              120.583006709331,
              24.36872759959881,
              0
            ],
            [
              120.5831043381777,
              24.3686038851846,
              0
            ],
            [
              120.583270002946,
              24.36855837606856,
              0
            ],
            [
              120.5830933475751,
              24.368297504568,
              0
            ],
            [
              120.5830307754979,
              24.3683371998428,
              0
            ],
            [
              120.5829575454193,
              24.3683446890568,
              0
            ],
            [
              120.5826732381604,
              24.36836167075809,
              0
            ],
            [
              120.5825451300096,
              24.36833592395355,
              0
            ],
            [
              120.5823207695624,
              24.3681006367924,
              0
            ],
            [
              120.5791463290005,
              24.36460735698692,
              0
            ],
            [
              120.5775792282409,
              24.36288366175093,
              0
            ],
            [
              120.5768514184321,
              24.36207717940362,
              0
            ],
            [
              120.5762740027968,
              24.36099145955537,
              0
            ],
            [
              120.575766887674,
              24.35995245284623,
              0
            ],
            [
              120.5756871544027,
              24.35974552701417,
              0
            ],
            [
              120.5757411873115,
              24.35971433053009,
              0
            ],
            [
              120.5756419239603,
              24.35945173352362,
              0
            ],
            [
              120.5755397882406,
              24.35914758197116,
              0
            ],
            [
              120.5754669369203,
              24.35899292772426,
              0
            ],
            [
              120.5736634031576,
              24.35695881525832,
              0
            ],
            [
              120.5729869563581,
              24.35618105273344,
              0
            ],
            [
              120.5727683999461,
              24.35593247004188,
              0
            ],
            [
              120.5723108803832,
              24.35541779777944,
              0
            ],
            [
              120.5717654775204,
              24.35480268949889,
              0
            ],
            [
              120.5685798279211,
              24.35240421753592,
              0
            ],
            [
              120.5685940202382,
              24.35237975848675,
              0
            ],
            [
              120.5684927279362,
              24.35231053257766,
              0
            ],
            [
              120.5684762677201,
              24.35226948436874,
              0
            ],
            [
              120.568323176439,
              24.35214356118948,
              0
            ],
            [
              120.568212518004,
              24.35207301226139,
              0
            ],
            [
              120.5681789388887,
              24.35206575330321,
              0
            ],
            [
              120.5680971363949,
              24.35199756076731,
              0
            ],
            [
              120.5680678074999,
              24.35201940535568,
              0
            ],
            [
              120.5680049091377,
              24.35197107518338,
              0
            ],
            [
              120.5666444973459,
              24.35095148749128,
              0
            ],
            [
              120.5658933867332,
              24.35037865697169,
              0
            ],
            [
              120.5657841460109,
              24.35037301356264,
              0
            ],
            [
              120.565660034796,
              24.35028923226278,
              0
            ],
            [
              120.5656719660554,
              24.35022218544449,
              0
            ],
            [
              120.5652110713032,
              24.34987613183801,
              0
            ],
            [
              120.5650666773918,
              24.34976886299155,
              0
            ],
            [
              120.5650188683109,
              24.34966797227073,
              0
            ],
            [
              120.5650188461828,
              24.34961167971901,
              0
            ],
            [
              120.5650469647819,
              24.34954409481145,
              0
            ],
            [
              120.5655019130928,
              24.34907117648777,
              0
            ],
            [
              120.5652583697597,
              24.34891128843589,
              0
            ],
            [
              120.5650808082103,
              24.34887956149158,
              0
            ],
            [
              120.5637814407557,
              24.34800908882845,
              0
            ],
            [
              120.5631464568627,
              24.34758568625277,
              0
            ],
            [
              120.5625169609637,
              24.34716212156064,
              0
            ],
            [
              120.5623664069957,
              24.3469783087667,
              0
            ],
            [
              120.5621972734591,
              24.34671980239838,
              0
            ],
            [
              120.5616208370893,
              24.34585709397646,
              0
            ],
            [
              120.5612051177338,
              24.34521523542871,
              0
            ],
            [
              120.5609687526726,
              24.34480151546926,
              0
            ],
            [
              120.5607906279275,
              24.34444847750229,
              0
            ],
            [
              120.5605757468271,
              24.34386680113841,
              0
            ],
            [
              120.5604301716253,
              24.34327867394368,
              0
            ],
            [
              120.5604453882704,
              24.34323142060003,
              0
            ],
            [
              120.5604868396057,
              24.34321840407153,
              0
            ],
            [
              120.5603671781459,
              24.34271094182251,
              0
            ],
            [
              120.5602760539425,
              24.34235863674666,
              0
            ],
            [
              120.5602021116227,
              24.34234407230048,
              0
            ],
            [
              120.5600730582679,
              24.3418249235617,
              0
            ],
            [
              120.5597206368378,
              24.34045404463282,
              0
            ],
            [
              120.5597120840243,
              24.34031726376509,
              0
            ],
            [
              120.5597503704237,
              24.34013815754594,
              0
            ],
            [
              120.5598704732339,
              24.33996501907678,
              0
            ],
            [
              120.5600237477435,
              24.33985877146392,
              0
            ],
            [
              120.5615341053223,
              24.33915925638177,
              0
            ],
            [
              120.5622539270728,
              24.33881670352129,
              0
            ],
            [
              120.5625712446714,
              24.33868112033537,
              0
            ],
            [
              120.5629423597803,
              24.33859226039386,
              0
            ],
            [
              120.5649328373442,
              24.33765925047392,
              0
            ],
            [
              120.5659620402299,
              24.33722571401425,
              0
            ],
            [
              120.566476416393,
              24.33698958295173,
              0
            ],
            [
              120.566738091808,
              24.33686903423337,
              0
            ],
            [
              120.5670100109446,
              24.33676040198855,
              0
            ],
            [
              120.5674429538203,
              24.33765129398947,
              0
            ],
            [
              120.5676747522863,
              24.33808083457394,
              0
            ],
            [
              120.5679001593443,
              24.33849249363847,
              0
            ],
            [
              120.5684478308312,
              24.3394972913518,
              0
            ],
            [
              120.5685868202875,
              24.3397555930894,
              0
            ],
            [
              120.5686818982693,
              24.34003210434057,
              0
            ],
            [
              120.5687608395344,
              24.3402106290938,
              0
            ],
            [
              120.5689932866862,
              24.34053728219732,
              0
            ],
            [
              120.5694220647325,
              24.34031486172577,
              0
            ],
            [
              120.5698556880357,
              24.34014353190869,
              0
            ],
            [
              120.5703281779736,
              24.3399941860338,
              0
            ],
            [
              120.5705568319296,
              24.33993993073926,
              0
            ],
            [
              120.5707795287238,
              24.33987586901746,
              0
            ],
            [
              120.5705041671633,
              24.33880681676354,
              0
            ],
            [
              120.5702466645863,
              24.33773533567737,
              0
            ],
            [
              120.5699371691471,
              24.33641226717828,
              0
            ],
            [
              120.5695968513464,
              24.33511025834922,
              0
            ],
            [
              120.5685201015915,
              24.33072002497236,
              0
            ],
            [
              120.5679115232821,
              24.32839082298905,
              0
            ],
            [
              120.567324007655,
              24.32606275051943,
              0
            ],
            [
              120.5667081927257,
              24.32374456455993,
              0
            ],
            [
              120.5664278351253,
              24.32261226505538,
              0
            ],
            [
              120.5657979235358,
              24.32029611502634,
              0
            ],
            [
              120.56506457542,
              24.32013451122155,
              0
            ],
            [
              120.5651279893314,
              24.32041642516095,
              0
            ],
            [
              120.5652055307674,
              24.32069392342165,
              0
            ],
            [
              120.565354446179,
              24.32125254767045,
              0
            ],
            [
              120.5656331037123,
              24.32216092269285,
              0
            ],
            [
              120.5659123671106,
              24.32334821663769,
              0
            ],
            [
              120.5651016868135,
              24.32355843956611,
              0
            ],
            [
              120.5639829586316,
              24.32386658128956,
              0
            ],
            [
              120.5631857310446,
              24.32408859100625,
              0
            ],
            [
              120.561336030611,
              24.3246319462742,
              0
            ],
            [
              120.5607448624667,
              24.32479948028132,
              0
            ],
            [
              120.5601603746387,
              24.32496781033147,
              0
            ],
            [
              120.5598055936508,
              24.32507855791989,
              0
            ],
            [
              120.5596280159044,
              24.32518466817211,
              0
            ],
            [
              120.5594575914807,
              24.32526619452001,
              0
            ],
            [
              120.5592844615061,
              24.32532390890903,
              0
            ],
            [
              120.5589790677897,
              24.32540166388796,
              0
            ],
            [
              120.5566900521417,
              24.32604538361196,
              0
            ],
            [
              120.5560996515511,
              24.32621941836161,
              0
            ],
            [
              120.5554969387603,
              24.32638352232973,
              0
            ],
            [
              120.5548517134269,
              24.32656760856808,
              0
            ],
            [
              120.5541886203815,
              24.32675709399813,
              0
            ],
            [
              120.5540087925578,
              24.32678391391516,
              0
            ],
            [
              120.5538579296971,
              24.32673681980335,
              0
            ],
            [
              120.5537632373046,
              24.32667620200041,
              0
            ],
            [
              120.5536934324281,
              24.32657026951849,
              0
            ],
            [
              120.5536454229399,
              24.32639770805451,
              0
            ],
            [
              120.5535857007886,
              24.3260926484553,
              0
            ],
            [
              120.5533170293409,
              24.32479549750265,
              0
            ],
            [
              120.5531811392141,
              24.324153974515,
              0
            ],
            [
              120.5531106191839,
              24.32382609166698,
              0
            ],
            [
              120.5530445584179,
              24.32350617682476,
              0
            ],
            [
              120.5527805202562,
              24.32226690321441,
              0
            ],
            [
              120.5526720819772,
              24.32174162241217,
              0
            ],
            [
              120.5525660234597,
              24.321196434919,
              0
            ],
            [
              120.5522609322154,
              24.32032850662819,
              0
            ],
            [
              120.5520733674516,
              24.31979150941646,
              0
            ],
            [
              120.5518820625047,
              24.31924026382474,
              0
            ],
            [
              120.5514673868195,
              24.31804492646795,
              0
            ],
            [
              120.5512276211133,
              24.31734308053943,
              0
            ],
            [
              120.5509925054037,
              24.31664630401593,
              0
            ],
            [
              120.5508773444218,
              24.31628960231732,
              0
            ],
            [
              120.5507892877117,
              24.31594135535867,
              0
            ],
            [
              120.5507192314355,
              24.31501708977025,
              0
            ],
            [
              120.5507546918106,
              24.31491340749974,
              0
            ],
            [
              120.5510169350465,
              24.31489081309153,
              0
            ],
            [
              120.5511514187752,
              24.31488591444388,
              0
            ],
            [
              120.5511555110509,
              24.31491732281721,
              0
            ],
            [
              120.5512384712767,
              24.31488645714438,
              0
            ],
            [
              120.5512676629089,
              24.31468780512464,
              0
            ],
            [
              120.551259285071,
              24.31466770505556,
              0
            ],
            [
              120.550600274714,
              24.31454730347799,
              0
            ],
            [
              120.5504928049587,
              24.31445848820016,
              0
            ],
            [
              120.5503606959715,
              24.31402735957573,
              0
            ],
            [
              120.5503145851637,
              24.31365665654926,
              0
            ],
            [
              120.5500891371022,
              24.31312894623766,
              0
            ],
            [
              120.5499570251716,
              24.3127842895257,
              0
            ],
            [
              120.5498913408302,
              24.31259967517139,
              0
            ],
            [
              120.5498541868537,
              24.31251432309171,
              0
            ],
            [
              120.5498487658552,
              24.31244014329216,
              0
            ],
            [
              120.5498928800859,
              24.31235882299138,
              0
            ],
            [
              120.5501309963953,
              24.31227108150419,
              0
            ],
            [
              120.5502875835248,
              24.31222248824942,
              0
            ],
            [
              120.5502227085401,
              24.31204754791773,
              0
            ],
            [
              120.5502767176494,
              24.31202320024543,
              0
            ],
            [
              120.5502648748417,
              24.31199361141895,
              0
            ],
            [
              120.5500482707463,
              24.31205612968088,
              0
            ],
            [
              120.5499995936039,
              24.31205328737677,
              0
            ],
            [
              120.5499696967155,
              24.31203252221504,
              0
            ],
            [
              120.5499183371152,
              24.3117559533748,
              0
            ],
            [
              120.5498953035463,
              24.3115182966443,
              0
            ],
            [
              120.5499249029626,
              24.31146532344762,
              0
            ],
            [
              120.5502935955426,
              24.31137212138455,
              0
            ],
            [
              120.5501774037244,
              24.31104251405896,
              0
            ],
            [
              120.5500550660188,
              24.31072069767748,
              0
            ],
            [
              120.5499257530471,
              24.31037831304146,
              0
            ],
            [
              120.5497935559994,
              24.31003641004226,
              0
            ],
            [
              120.5490130144169,
              24.30796819989265,
              0
            ],
            [
              120.5486191822275,
              24.30692804249663,
              0
            ],
            [
              120.5482390799811,
              24.30587843662034,
              0
            ],
            [
              120.5465372337827,
              24.30622440375452,
              0
            ],
            [
              120.5464493487781,
              24.30491184285237,
              0
            ],
            [
              120.5463503180342,
              24.30320196325165,
              0
            ],
            [
              120.5461579347578,
              24.30316996502473,
              0
            ],
            [
              120.5460340629882,
              24.30319483710237,
              0
            ],
            [
              120.5459069809691,
              24.3032414374719,
              0
            ],
            [
              120.5458029976,
              24.30334916072519,
              0
            ],
            [
              120.5457575102089,
              24.30351940889222,
              0
            ],
            [
              120.5457930784058,
              24.30373374305997,
              0
            ],
            [
              120.5457191938618,
              24.30387804652917,
              0
            ],
            [
              120.5456242918306,
              24.30400166842325,
              0
            ],
            [
              120.5453352508241,
              24.3041289878378,
              0
            ],
            [
              120.5450040617722,
              24.30410081993699,
              0
            ],
            [
              120.5448770275433,
              24.30419714562274,
              0
            ],
            [
              120.5447258489675,
              24.30458495676197,
              0
            ],
            [
              120.5443773501871,
              24.30476583445649,
              0
            ],
            [
              120.5432642676932,
              24.30537143630402,
              0
            ],
            [
              120.5421614374778,
              24.30594323116863,
              0
            ],
            [
              120.5399571725421,
              24.30710360207494,
              0
            ],
            [
              120.5394942458123,
              24.30734216358646,
              0
            ],
            [
              120.539020897649,
              24.30759170160802,
              0
            ],
            [
              120.538079850218,
              24.30808644504607,
              0
            ],
            [
              120.5361895538839,
              24.30908266286481,
              0
            ],
            [
              120.5340478409537,
              24.31020425741047,
              0
            ],
            [
              120.5319238803556,
              24.31128149342203,
              0
            ],
            [
              120.5296771425839,
              24.31242597774416,
              0
            ],
            [
              120.5288697888841,
              24.31283284894689,
              0
            ],
            [
              120.5281914004583,
              24.31315235548087,
              0
            ],
            [
              120.5277893183753,
              24.31323936609956,
              0
            ]
          ]
        },
        "properties": {
          "name": "自行車路線1",
          "styleUrl": "#__managed_style_072A0DED7E3609FDA2C4",
          "fill-opacity": 0.25098039215686274,
          "fill": "#ffffff",
          "stroke-width": 4.57143,
          "icon-offset": [
            64,
            128
          ],
          "icon-offset-units": [
            "pixels",
            "insetPixels"
          ],
          "icon": "https://earth.google.com/earth/document/icon?color=1976d2&id=2000&scale=4"
        },
        "id": "05367D9C1D360A47FAC8"
      }
    ]
  },
  videos: [
    'https://youtu.be/qhU_8Yf7PbM?si=m5AOHzrlNJy3F-5n'
    , 'https://youtube.com/shorts/1jr7IAWloD8?si=y65rd5_g0VxdrOFg'
  ],
  instagram: [],
  attractions: ['自行車','大甲', '高美濕地', '大安沙丘', '濱海自行車道大安段', '61西部濱海公路', '龜殼生態公園', '溫寮漁港']
}
];