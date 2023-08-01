// ==UserScript==
// @name         Select All Items
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match         *://*/the-luc/tang-bao-cac/?s=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sangtacvietfpt.com
// @grant        none
// ==/UserScript==
/*
    How to use: https://sangtacviet.vip/the-luc/tang-bao-cac/?s=lt-tld-tkd4-tkd6
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
    var list = search.split('=')[1].split('-');
    list.forEach(s => {
        var item = map[s];
        if (item) {
            document.querySelectorAll(`#tuitruvat a${item.e ? `[e="${item.e}"]` : ''}${item.l ? `[l="${item.l}"]` : ''}${item.tag ? `[tag="${item.tag}"]` : ''}:not([hide="hide"])`).forEach(el=>{
                el.click();
                var n = el.getAttribute('n');
                if (n) Array.from({length: n-1}, () => el.click());
            });
        }
    })
})();
