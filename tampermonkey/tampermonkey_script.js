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

    var rand = (min, max) => parseInt(Math.random() * (max - min) + min);

    var request = async (params, query) => {
        var url = '/index.php';
        if (query) {
            url = url + query;
        }
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
                const text = await response.text();
                try {
                    return JSON.parse(text);
                } catch {
                    return text;
                }
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
            var response = await isCollectible();
            if (response.code == 1) {
                setTimeout(async () => {
                    var collectableItem = await checkItem();
                    if (collectableItem) {
                        setTimeout(() => {
                            showNotification(collectableItem.info);
                            collectItem(collectableItem);
                        }, rand(1, 5))
                    }
                }, rand(1, 5))
            }
        } catch (error) {
            console.log("error :>> ", error.message);
            //alert(error.message);
        }
    }

    var isCollectible = () => {
        var params = "ngmar=tcollect&ajax=trycollect&ngmar=iscollectable";
        var query = "?ngmar=iscollectable";
        return request(params, query);
    };

    var checkItem = () => {
        var params = "ngmar=collect&ajax=collect";
        return request(params);
    };

    var collectItem = (collectableItem) => {
        count++;
        var query = "?ngmar=fcl";
        var params = "ajax=fcollect&c=" + rand(10000, 800000);
        var cType = collectableItem.type;
        if (cType == 3) {
            let pt = listPT[rand(0, listPT.length)];
            params += "&newname=" + encodeURI(pt.name) + "&newinfo=" + encodeURI(pt.info);
        }
        return request(params, query);
    };

    var getLuckyNumber = async () => {
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

    var addPageCount = function () {
        var query = '?ngmar=readcounter'
        var params = "sajax=read";
        return request(params, query);
    }

    var startInterval = (waitTime) => {
        intervalId = window.setInterval(() => {
            if (count == 10) {
                window.location.reload();
                return
            }
            addPageCount();
            setTimeout(async () => {
                startCollectItem();
            }, rand(10, 50) * 1000);
        }, waitTime);
    };

    startCollectItem();
    getLuckyNumber();

    // var addOnlineTime = function () {
    //     var url = '/index.php?ngmar=ol2';
    //     var params = "sajax=online&ngmar=ol";
    //     return request(params, url);
    // }

    // var userid;
    // var addOnlineTimeInterval = () => {
    //     window.setInterval(() => {
    //         addOnlineTime();
    //     }, 5 * 60 * 1000);
    //     window.setInterval(() => {
    //         addPageCount();
    //     }, 4 * 60 * 1000);
    // };

    // addOnlineTimeInterval();


})();