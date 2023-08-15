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
    div.style = 'position: absolute;top: 0;right: 0;border: 1px solid gray;border-radius: 5px;padding: 10px;background-color: #ccc;margin: 10px;display:none;';
    document.body.appendChild(div);

    div.onclick = function () {
        hideNotification();
    }

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

    var request = async (params) => {
        var url = '/index.php';
        var retry = 0;
        if (params && params.indexOf("ajax=") >= 0) {
            url += "?ngmar=" + params.substr(5, 4);
        }
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

    var waitTime = 5 * 60 * 1000;
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
        var params = "ajax=fcollect&c=137";
        var cType = collectableItem.type;
        if (cType == 3) {
            let nname = "【⚡ Lôi Chi Pháp Tắc 】";
            let qq = "Quy tắc trong thiên địa, ẩn chứa lôi đình chi lực. Đòn tấn công có thể gây choáng nặng. Tăng tỉ lệ lĩnh ngộ Lôi pháp tắc !";
            params += "&newname=" + encodeURI(nname) + "&newinfo=" + encodeURI(qq);
        }
        return request(params);
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

})();