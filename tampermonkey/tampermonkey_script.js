// ==UserScript==
// @name         Auto Collect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Tung Do (nhattieunhatkiem@gmail.com)
// @match        *://*/user/0/
// @match        *://*/truyen/*/*/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sangtacviet.vip
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    var div = document.createElement('div');
    div.id = 'notification';
    div.style = 'position: fixed;top: 0;right: 0;border: 1px solid gray;border-radius: 5px;padding: 10px;background-color: #ccc;margin: 10px;display:none;';
    document.body.appendChild(div);

    div.onclick = function () {
        hideNotification();
    }

    var listPT = [{
        name: '【⚡ Lôi Chi Pháp Tắc 】',
        info: 'Quy tắc trong thiên địa, ẩn chứa lôi đình chi lực. Đòn tấn công có thể gây choáng nặng. Tăng tỉ lệ lĩnh ngộ Lôi pháp tắc !'
    }, {
        name: '【 Dẫn Lôi Thuật 】',
        info: 'Dẫn Lôi Thuật là một cái phép thuật hệ lôi, dùng để triệu hoán sét từ trên trời đánh xuống.'
    }, {
        name: '【 Tụ Lý Càn Khôn 】',
        info: 'Tụ Lý Càn Khôn là phép thuật thu nhỏ vật, người rồi hút vào trong ống tay áo.Khi phóng ra từ ống tay áo thì vật thu nhỏ trở lại thể tích như cũ.'
    }, {
        name: '【 Chưởng Tâm Lôi 】',
        info: 'Chưởng Tâm Lôi là một cái phép thuật điều khiển sấm sét, chuyên dùng để đối phó các quỷ vật.'
    }, {
        name: '【 Bình Thổ Chú 】',
        info: 'Bình Thổ Chú là phép thuật hệ Thổ, dùng để lấp hố bằng cách hội tụ đất đá, cát ở xung quanh.'
    }, {
        name: '【 Thuật Quy Tức 】',
        info: 'Quy Tức Thuật là Phép Thuật giúp giảm số lần hít thở. Việc giảm hít thở giúp Tu Sĩ có thể đi vào những nơi thiếu dưỡng khí như dưới nước, sâu trong lòng đất hay môi trường chân không.'
    }, {
        name: '【 Bá Thần Trụ 】',
        info: 'Bá Thần Trụ có thể công kích, phòng ngự, huyễn thuật, chữa trị, cường hóa, phong ấn,tạo ra trận pháp bằng trụ,.. Có thể nói là có nhiều tác dụng đa dạng.'
    }, {
        name: '【 Cuồng Phong Độn Pháp 】',
        info: 'Khi sử dụng, trên thân đao hiện lên gió bão màu xanh, phát ra âm thanh ầm ầm như xe thể thao.'
    }]

    var showNotification = (message) => {
        var el = document.getElementById('notification');
        el.textContent = message;
        el.style.display = 'block';
        setTimeout(() => {
            el.style.display = 'none';
        }, 15000)
    }

    var hideNotification = () => {
        var el = document.getElementById('notification');
        el.style.display = 'none';
    }

    var request = async (params, url) => {
        url = url || '/index.php';
        var retry = 0;
        try {
            const response = await fetch(url, {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded",
                },
                "body": params,
                "method": "POST"
            });
            if (!response.ok) {
                if (retry == 3) {
                    retry = 0;
                    throw new Error("Network response was not OK");
                }
                setTimeout(function () {
                    request(params, retry++);
                }, 1000);
            } else {
                return await response.json();
            }
        } catch (error) {
            console.error("There has been a problem with your fetch operation:", error);
        }
    };

    var count = 0;
    var lucky = 1;
    var intervalId;

    var startCollectItem = async () => {
        console.log("Starting request...");
        try {
            var collectableItem = await checkItem();
            if (collectableItem) {
                showNotification(collectableItem.info);
                collectItem(collectableItem);
            }
        } catch (error) {
            console.log("error :>> ", error.message);
            //alert(error.message);
        }
    }

    var checkItem = () => {
        var params = "ngmar=collect&ajax=collect";
        return request(params);
    };

    var collectItem = (collectableItem) => {
        count++;
        var url = '/index.php?ngmar=fcl';
        var params = "ajax=fcollect&c=137";
        var cType = collectableItem.type;
        if (cType == 3) {
            let min = 0;
            let max = listPT.length;
            let pt = listPT[parseInt(Math.random() * (max - min) + min)];
            params += "&newname=" + encodeURI(pt.name) + "&newinfo=" + encodeURI(pt.info);
        }
        return request(params, url);
    };

    var getLucky = async () => {
        var url = "/user/0/";
        var response = await fetch(url);
        var data = await response.text();
        var matches = data.match(/Vận khí.*?<span.*?>.*?(\d+)/s);
        lucky = matches.length > 1 ? parseInt(matches[1]) : 1;
        var waitTime =
            (lucky < 50
                ? 5
                : lucky < 150
                    ? 4
                    : lucky < 250
                        ? 3
                        : 2) *
            60 *
            1000;
        window.clearInterval(intervalId);
        startInterval(waitTime);
    };

    startCollectItem();
    getLucky();

    var startInterval = (waitTime) => {
        intervalId = window.setInterval(() => {
            startCollectItem();
        }, waitTime);
    };

    var addOnlineTime = function () {
        var url = '/index.php?ngmar=ol2';
        var params = "sajax=online&ngmar=ol";
        return request(params, url);
    }

    var addPageCount = function () {
        var params = "sajax=read";
        return request(params);
    }

    var userid;
    var addOnlineTimeInterval = () => {
        window.setInterval(() => {
            addOnlineTime();
        }, 5 * 60 * 1000);
    };

    addOnlineTimeInterval();


})();