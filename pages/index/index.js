//index.js
//获取应用实例
var app = getApp();
var THREE = require('../../utils/three')
var requestAnimationFrame;
var camera, scene, renderer;
var mouseX = 0,
    mouseY = 0;
var windowHalfX = 0;
var windowHalfY = 0;
var main = null;
const Main = require('./game/index');

Page({
    data: {},
    onLoad: function() {

    },
    onUnload() {
        main = null;
    },
    onReady: function() {
        this.setData({
            canvasWidth: app.SystemInfo.windowWidth * app.SystemInfo.pixelRatio,
            canvasHeight: (app.SystemInfo.windowHeight - 100) * app.SystemInfo.pixelRatio,
            canvasStyleWidth: app.SystemInfo.windowWidth + "px",
            canvasStyleHeight: (app.SystemInfo.windowHeight - 100) + "px",
        }, () => {
            var self = this;
            var query = wx.createSelectorQuery().select('#webgl').node();
            query.exec((res) => {
                let canvas = res[0].node;
                requestAnimationFrame = canvas.requestAnimationFrame;

                canvas.width = app.SystemInfo.windowWidth * app.SystemInfo.pixelRatio;
                canvas.height = (app.SystemInfo.windowHeight - 100) * app.SystemInfo.pixelRatio;
                canvas.style = {};
                canvas.style.width = canvas.width;
                canvas.style.height = canvas.height;
                console.log('canvas', canvas);
                main = new Main(canvas);
            });
        });

    },
    addPen() {
        main.addPen();
    },
    makePenFly() {
        main.makePenFly();
    },
    clear() {
        main.clear();
    },

    onTouchStart: function(event) {},
    onTouchMove: function(event) {
        // console.log(event);
        mouseX = (event.touches[0].clientX || event.touches[0].x - windowHalfX) * 3;
        mouseY = (event.touches[0].clientY || event.touches[0].y - windowHalfY) * 3;
    },
    onTouchEnd: function(event) {},
})