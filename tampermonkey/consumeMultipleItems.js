// ==UserScript==
// @name         Consume Multiple Items
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match         *://*/user/0/?c=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sangtacvietfpt.com
// @grant        none
// ==/UserScript==
/*
    How to use: https://sangtacviet.vip/user/0/?c=lt-tld-tkd4-tkd6
    lt = linh thach
    tld = tu linh dan
    tvd = thien van dan
    cp = cong phap
    tkd = tu khi dan
    ttd = tay tuy dan
    all = chon tat ca
*/

(function() {
    'use strict';
    // Your code here...
    var search = document.location.search;
    if (!search) return;
    var map = {
        'lt': {
            e: 1,
            tag: 1
        },
        'cp': {
            e: 4,
            tag: 3
        },
        'tld': {
            e: 2,
            tag: 2
        },
        'tld4': {
            e: 2,
            tag: 2,
            l: 4
        },
        'tld5': {
            e: 2,
            tag: 2,
            l: 5
        },
        'tld6': {
            e: 2,
            tag: 2,
            l: 6
        },
        'tvd': {
            e: 10,
            tag: 2
        },
        'tvd4': {
            e: 10,
            tag: 2,
            l: 4
        },
        'tvd5': {
            e: 10,
            tag: 2,
            l: 5
        },
        'tvd6': {
            e: 10,
            tag: 2,
            l: 6
        },
        'tkd': {
            e: 1,
            tag: 2
        },
        'tkd4': {
            e: 1,
            tag: 2,
            l: 4
        },
        'tkd5': {
            e: 1,
            tag: 2,
            l: 5
        },
        'tkd6': {
            e: 1,
            tag: 2,
            l: 6
        },
        'ttd': {
            e: 3,
            tag: 2
        },
        'ttd4': {
            e: 3,
            tag: 2,
            l: 4
        },
        'ttd5': {
            e: 3,
            tag: 2,
            l: 5
        },
        'ttd6': {
            e: 3,
            tag: 2,
            l: 6
        },
        'all': {

        }
    }
    var listActions = search.split('=')[1].split('-');
    var listItems = [];
    listActions.forEach(s => {
        var item = map[s];
        if (item) {
            document.querySelectorAll(`#tuitruvat a${item.e ? `[e="${item.e}"]` : ''}${item.l ? `[l="${item.l}"]` : ''}${item.tag ? `[tag="${item.tag}"]` : ''}`).forEach((el, index)=>{
                if (s.indexOf('ttd') != -1 && index >= 5) return;//limit at 5
                var iid = el.getAttribute('i');
                listItems.push(iid);
            });
        }
    });

    if (listItems.length == 0) return;

    fetch('/index.php', {
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
        },
        "body": "ajax=dungnhieu&consume=" + listItems.join(','),
        "method": "POST"
    }).then(response => {
        response.text().then((text) => console.log('text', text));
    });
    
})();
