//app.js
var getConfigCount = 0;
var app = '';
var wxKit = require('./utils/wx');
// const THREE = require('./utils/three.js')
// const setting = require('./utils/setting.js')
App({
    onLaunch: function(option) {
        //调用API从本地缓存中获取数据
        app = this;


        this.setNavBarConfig()
            // this.getShare()
    },

    SystemInfo: {},

    globalData: {},


    /**
     * 计算状态栏以及返回栏高度
     */
    setNavBarConfig() {
        getConfigCount++;
        if (getConfigCount >= 100) return;
        try {
            let res = wx.getSystemInfoSync();
            if (!res) {
                console.log('getConfig Fail');
                app.setNavBarConfig();
                return;
            }

            if (res.screenHeight <= 0 || res.screenWidth <= 0 || res.windowHeight <= 0 || res.windowWidth <= 0) {
                console.log('getConfig Fail');
                app.setNavBarConfig();
                return;
            }

            console.log('system res', res);
            this.SystemInfo = res;

        } catch (e) {
            console.log(e);
        }
    },


});