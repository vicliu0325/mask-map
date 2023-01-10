// console.log(data);
// const data2 = data.features;
// console.log(data2);

if ('geolocation' in navigator) {
    // 如果定位可以運行，就印出 'geolocation available'
        console.log('geolocation available');
        // 取得使用者位置的經緯度
        navigator.geolocation.getCurrentPosition(position => {
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
        // 印出使用者位置的經緯度
        console.log(userLat, userLng);
        // 以使用者的經緯度取代 [0, 0]
        map.setView([userLat, userLng], 20);
        // 在使用者所在位置標上 marker
        marker.setLatLng([userLat,userLng]).bindPopup(
            `<h3>你的位置</h3>`)
            .openPopup();
        });
    } else {
    // 如果定位無法運行，就印出 'geolocation not available'
        console.log('geolocation not available');
    }

//     // 做出縣市的 dictionary
//     for (const feature of data.features) {
//         const county = feature.properties.county;
//         const town = feature.properties.town;
//         if (typeof cityMap[county] === 'undefined') {
//         cityMap[county] = {}; 
//         }
//         cityMap[county][town] = 1;
//     }

// // 整理格式
// const keys = Object.keys(cityMap);
// for (const i of keys) {
//     cityMap[i] = Object.keys(cityMap[i]);
// }


// btnScrollToTop
const btnScrollToTop = document.querySelector('#btnScrollToTop');

btnScrollToTop.addEventListener('click',function(){
    const el = document.querySelector('.sidebar');
    //方法一
    // window.scrollTo(0,0);

    //方法二
    el.scrollTo({
        top:0,
        left:0,
        behavior:"smooth"
    });

    //方法三
    // $("html, body").animate({ scrollTop:0 }, "slow");
});

const date = new Date();
const day = date.getDay();
// 顯示資料用
function renderDay(){
    // 判斷日期
    let date = new Date();//建立Date物件 137
    let day = date.getDay();//回傳禮拜幾
    let chineseDay = judgeDayChinese(day);
    // 顯示今天日期到網頁
    let today = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    // console.log(today);
    document.querySelector('.jsDate span').textContent = chineseDay;
    document.querySelector('.today').textContent = today;
    //判斷身分證奇偶數，顯示可以購買號碼
    if(day == 1 ||  day ==3 || day ==5){
        document.querySelector('.odd').style.display ='block';
    }else if(day ==2 || day ==4 || day ==6){ 
        document.querySelector('.even').style.display ='block';
    }else{
        document.querySelector('.all').style.display ='block';
    }
    
};




//工具類 函式 輸入東西>輸出內容
function judgeDayChinese(day){
    if(day =="1"){
        return "一";
    }else if(day =="2"){
        return "二";
    }else if(day =="3"){
        return "三";
    }else if(day =="4"){
        return "四";
    }else if(day =="5"){
        return "五";
    }else if(day =="6"){
        return "六";
    }else if(day =="0"){
        return "日";
    }
};
function init(){
    renderDay();
    geyData();//抓資料
    // renderList();
}
var data;
function geyData(){
    let xhr = new XMLHttpRequest();
    xhr.open('get','https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json',true);
    xhr.send();
    xhr.onload = function(){
        data = JSON.parse(xhr.responseText);
        //將JSON資料轉換為Javascript物件，讓瀏覽器操作運用
        renderList('臺北市');//預設顯示臺北市
    };
};

function renderList(city){
    let ary = data.features;
    let str = '';
    let town = [];
    for(let i=0; i<ary.length; i++){
        if(ary[i].properties.county == city){
            // str +=  '<li class="pharmacy">' + ary[i].properties.name + '<br>' + '成人口罩：' + ary[i].properties.mask_adult + '<br>' + '兒童口罩' + ary[i].properties.mask_child  + '</li>';
            str += `
            <li class="pharmacy">${ary[i].properties.name}</li>
            <li class="pharmacy-address">${ary[i].properties.address}</li>
            <li class="pharmacy-phone">${ary[i].properties.phone}</li>
            <div class="mask-count">
                <p class="mask-adult">
                    <span>成人口罩：</span>
                    <span class="mask-number">${ary[i].properties.mask_adult}</span>
                </p>
                <p class="mask-child">
                    <span>兒童口罩：</span>
                    <span class="mask-number">${ary[i].properties.mask_child}</span>
                </p>
            </div>`
        }

    };
    document.querySelector('.list').innerHTML = str;
}

init();//當網頁在載入預設執行哪些函式

document.querySelector('.county').addEventListener('change',function(e){
    renderList(e.target.value);
});

// renderTown
function renderTown(){

}

//leaflet
// initialize the map on the "map" div with a given center and zoom

var map = L.map('map', { //設定一個地圖，把這個地圖定位#map
    center: [25.052137,121.555235], //先設定map座標
    zoom: 19 //zoom縮放等級 定位在18 
});



// 載入圖資openStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
{foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);//把圖資加入到map變數上

let geoBtn = document.getElementById('jsGeoBtn');
geoBtn.addEventListener('click',function(){
    map.setView([userLat, userLng], 13);
    marker.setLatLng([userLat,userLng]).bindPopup(
        `<h3>你的位置</h3>`)
        .openPopup();
},false);

//換icon顏色
var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',//改.png前面顏色 //icon背景圖片
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', //icon陰影
    iconSize: [25, 41], //icon size 寬高
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',//改.png前面顏色 //icon背景圖片
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', //icon陰影
    iconSize: [25, 41], //icon size 寬高
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });


// var data = [
//     {'name':'軟體園區',lat:22.604799,lng:120.2976256},
//     {'name':'ikea',lat:22.6066728,lng:120.3015429}
// ]  

// //在地圖的圖層上再把所有的位置點都加上去
// for (let i=0; i<data.length; i++){
//     console.log(data[i].name)
//     //在地圖的圖層上再把所有的位置點都加上去
//     markers.addLayer(L.marker([data[i].lat, data[i].lng,],{icon: greenIcon}));
// }
  
//加上一個marker，並設定他的座標，將座標放到地圖裡
// L.marker([25.052137,121.555235], {icon: greenIcon}).addTo(map)
//針對這個marker，加上HTML內容進去
    // .bindPopup('<h1>測試藥局</h1><p>成人口罩：50</p><p>兒童口罩：50</p>')
//預設把它開啟顯示在地圖上
    // .openPopup();

//增加一個圖層群組，圖層專門放icon群組
var markers = new L.MarkerClusterGroup().addTo(map);;

//開啟一個網路請求
var xhr = new XMLHttpRequest();

//準備要跟伺服器要口罩剩餘數量資料
xhr.open('get','https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json');

//執行要資料的動作
xhr.send();

//當資料回傳時，下面語法就會自動觸發 
xhr.onload = function(){
    //ajax回傳是字串格式
    //將字串轉成陣列的JSON格式
    var data =JSON.parse(xhr.responseText).features;//陣列裡面的string資料

    //依序把marker倒進圖層裡
    // for (let i=0;i<data.length;i++){
    //     // markers.addLayer(L.marker([data[i].geometry.coordinates[1],data[i].geometry.coordinates[0]],{icon: greenIcon}.bindPopup(data[i].properties.name)));//針對這個marker，加上HTML內容進去
    //     markers.addLayer(L.marker([data[i].geometry.coordinates[1],
    //         data[i].geometry.coordinates[0]],
    //         {icon: greenIcon})
    //       );
    // }
    // map.addLayer(markers);
    for(let i =0;data.length>i;i++){
        var mask;
        if (data[i].properties.mask_adult == 0){
            mask = redIcon;
        }else {
            mask = greenIcon;
        }
  
        markers.addLayer(L.marker([data[i].geometry.coordinates[1],data[i].geometry.coordinates[0]], {icon: greenIcon}).bindPopup(`<div><h1 class="map-pharmacy">${data[i].properties.name}</h1><p class="map-address">${data[i].properties.address}</p><p class="map-phone">${data[i].properties.phone}</p><div class="mask-count"><p class="map-adult">成人口罩：${data[i].properties.mask_adult}</p><p class="map-child">兒童口罩：${data[i].properties.mask_child}</p></div>`));
        // add more markers here...
        // L.marker().addTo(map)
        //   )
       }
       map.addLayer(markers);
};







