// ==UserScript==
// @name         Auto Collect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Tung Do
// @match        *sangtacviet.pro/truyen/*
// @match        *sangtacvietfpt.com/truyen/*
// @match        *sangtacviet.com/truyen/*
// @match        *sangtacviet.me/truyen/*
// @match        *sangtacviet.vip/truyen/*
// @match        *14.225.254.182/truyen/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sangtacviet.vip
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  var luckyNumber = 1;
  var intervalId;
  var luckyNumberWaitTime = 15 * 60 * 1000;// 5 minutes
  var host = 'http://14.225.254.182';

  var request = ({ url, params }) => {
    url = (url || "/index.php");
    return new Promise((resolve, reject) => {
      var http = new XMLHttpRequest();
      http.open("POST", url, true);
      http.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
          var response = http.responseText;
          try {
            if (params) {
              var itemInfo = JSON.parse(response);
              resolve(itemInfo);
            } else {
              resolve(response);
            }
          } catch (f) {
            reject({
              message: response,
            });
          }
        } else if (http.status !== 200) {
          reject({
            message: "Failed to make request",
          });
        }
      };
      http.send(params);
    });
  };

  var checkItem = () => {
    var params = "ngmar=collect&ajax=collect";
    return request({ params });
  };

  var collectItem = () => {
    var params = "ajax=fcollect&c=137";
    return request({ params });
  };

  var startCollectItem = async ()=> {
    console.log("Starting request...");
    try {
      var collectableItem = await checkItem();
      if (!collectableItem.error) {
        console.log("collectableItem :>> ", collectableItem);
        collectItem();
      }
    } catch (error) {
      console.log("error :>> ", error.message);
      //alert(error.message);
    }
  }

  var getLuckyNumber = async () => {
    var url = "/user/0/";
    var data = await request({ url });
    var matches = data.match(/Vận khí.*?<span.*?>.*?(\d+)/s);
    luckyNumber = matches.length > 1 ? parseInt(matches[1]) : 1;
    console.log("luckyNumber :>> ", luckyNumber);
    var waitTime = (luckyNumber < 50 ? 5 : luckyNumber < 150 ? 4 : luckyNumber < 250 ? 3 : 2) * 60 * 1000;
    window.clearInterval(intervalId);
    startInterval(waitTime);
  };

  var startInterval = (waitTime) => {
    intervalId = window.setInterval(() => {
        startCollectItem();
    }, waitTime);
  };

  startCollectItem();
  getLuckyNumber();

  var luckyNumberId = window.setInterval(() => {
    getLuckyNumber();
  }, luckyNumberWaitTime);
  
})();
