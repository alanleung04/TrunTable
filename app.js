//app.js
var qcloud = require('./vendor/qcloud-weapp-client-sdk/index');
var config = require('./config');
var Session = require('./vendor/qcloud-weapp-client-sdk/lib/session');
var getConfigCount = 0;
var app = '';
var api = require('./utils/api');
var wxKit = require('./utils/wx');
// const THREE = require('./utils/three.js')
// const setting = require('./utils/setting.js')
App({
    onLaunch: function(option) {
        //调用API从本地缓存中获取数据
        app = this;
        // app.THREE = THREE;
        // this.globalData.setting = setting
        var logs = wx.getStorageSync("logs") || [];
        logs.unshift(Date.now());
        wx.setStorageSync("logs", logs);

        // 展示本地存储能力

        qcloud.setLoginUrl(config.service.loginUrl);
        qcloud.setUnionLogin(config.service.unionLoginUrl);


        this.setNavBarConfig()
            // this.getShare()
    },

    getUserInfo: function(cb) {
        var that = this;
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo);
        } else {
            //调用登录接口
            wx.login({
                success: function() {
                    wx.getUserInfo({
                        success: function(res) {
                            that.globalData.userInfo = res.userInfo;
                            typeof cb == "function" && cb(that.globalData.userInfo);
                        }
                    });
                }
            });
        }
    },
    SystemInfo: {},

    globalData: {
        roomate: '',
        room: '',
        defaultShareCard: '',
        defaultShareImg: '',
        SDKVersion: '',
        userInfo: {
            id: -1
        }
    },

    /**
     * 检查用户授权情况
     */
    checkAuth() {
        // 先检查上次请求授权的时间
        return new Promise((resolve, reject) => {

            app.globalData.hasCheck = true;
            let checkDate = wx.getStorageSync('checkDate');
            // console.log('checkDate', checkDate);
            if (checkDate) {
                let date = new Date()
                let today = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
                if (today != checkDate) {
                    wxKit.getSetting('scope.userInfo').then(() => {
                        resolve(false)
                    }).catch(() => {
                        resolve(true)
                    })
                } else {
                    resolve(false)
                }
            } else {
                // 没有检查过授权
                wxKit.getSetting('scope.userInfo').then(() => {
                    resolve(false)
                }).catch(() => {
                    resolve(true)
                })
            }
        })
    },

    /**
     * 更新检查时间
     */
    updateCheckDate() {
        let date = new Date()
        let today = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
        wx.setStorageSync('checkDate', today);

    },

    /**
     * 获取分享图、分享标题
     */
    getShare() {
        api.getShare('FINISH').then(res => {
            if (res.data.code === 0) {
                this.globalData.shareData = res.data.data
            }
        })
    },



    getNavHeight() {
        let height = (config.statusBarHeight + config.titleHeight) / config.pixelRate + 64
        return height
    },

    /**
     * 计算状态栏以及返回栏高度
     */
    setNavBarConfig() {
        getConfigCount++;
        if (getConfigCount >= 100) return;
        try {
            let res = wx.getSystemInfoSync();
            // console.log('res', res);
            app.globalData.SDKVersion = res.SDKVersion;
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
            config.windowWidth = res.windowWidth;
            config.pixelRate = res.windowWidth / 750;
            config.platform = res.platform;
            config.statusBarHeight = res.statusBarHeight;
            if (res.platform.toLowerCase() == 'android') {
                config.capsuleHeight += 4;
            }
            config.titleHeight = (config.capsuleHeight + config.statusBarHeight) / config.pixelRate;
            if (res.statusBarHeight >= 44) {
                config.isHighHead = true;
            }
            if (res.windowHeight > 750) config.isAllScreen = true;
            config.systemHeight = res.windowHeight;
            app.globalData.navHeight = (config.statusBarHeight + config.capsuleHeight) / config.pixelRate

        } catch (e) {
            console.log(e);
        }
    },

    compareVersion: function(v1, v2) {
        v1 = v1.split('.')
        v2 = v2.split('.')
        var len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }

        for (var i = 0; i < len; i++) {
            var num1 = parseInt(v1[i])
            var num2 = parseInt(v2[i])

            if (num1 > num2) {
                return 1
            } else if (num1 < num2) {
                return -1
            }
        }

        return 0
    },

    navigateTo: function(path) {
        var url = path
        if (url.indexOf("?t=") == -1 && url.indexOf("&t=") == -1) {
            url += url.indexOf("?") == -1 ? "?" : "&"
            url += "t=" + new Date().getTime()
        }
        // console.log('url', url)
        wx.navigateTo({
            url: url,
            fail: function(res) {
                wx.redirectTo({
                    url: url
                })
            }
        })
        return;
        const tabBarPages = ['/pages/pay/pay', '/pages/more/more', '/pages/profile/profile']
        if (path.indexOf(tabBarPages[0]) == 0 || path.indexOf(tabBarPages[1]) == 0 || path.indexOf(tabBarPages[2]) == 0) {
            wx.reLaunch({
                url: url,
            })
        } else {

        }

    },


    onShow(options) {
        // setting.playBgm()
        console.log('onShow', options)
        app.globalData.scene = options.scene;

        // 普通路径规则
        if (options.query.source) {
            // wx.setStorageSync('source', options.query.source)
            app.globalData.source = options.query.source

        }

        // 扫小程序码进来的
        if (options.query.scene) {
            app.globalData.source = options.query.scene
        }
        // console.log('Hi歌在线')
        // api.userOnShow()

        // 从我的小程序打开小程序
        if (options.scene == 1089 || options.scene == 1001) {
            // api.onLoginWxApp().then(res => {
            //   console.log('事件上报---从我的小程序打开')
            // }).catch(err => {
            //   console.log('事件上报错误')
            // })
        }
    },

    onHide() {

    },

    // px rpx转换器
    pxTransformer(m, toRpx = false) {
        if (toRpx) {
            return m / config.pixelRate;
        }
        return Math.round(m * config.pixelRate);
    },

    getWindowWidth() {
        return config.windowWidth;
    },


});