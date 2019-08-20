/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
// var host = 'wy.bleege.com';

// var host = 'test-wxa.bleege.com'; 
// var host = 'se8204.bleege.com';
// var host = 'cy.bleege.com';
// var host = 'sunmen.bleege.com';
var host = 'cy-test.bleege.com';
// var host = 'kg.bleege.com';
// var host = '192.168.19.214:8080';

// var content = 'yinyu'
var content = 'idiom'
var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    hostUrl: `https://${host}/${content}/api`,
    // hostUrl: `http://${host}/${content}/api`,
    // 登录地址，用于建立会话 
    loginUrl: `https://${host}/${content}/api/v1/bleege/login`,
    // loginUrl: `http://${host}/${content}/api/v1/bleege/login`,
    // 非授权登陆地址
    unionLoginUrl: `https://${host}/${content}/api/v1/bleege/unionLogin`,
    // unionLoginUrl: `http://${host}/${content}/api/v1/bleege/unionLogin`,
    // 测试的请求地址，用于测试会话
    requestUrl: `https://${host}/${content}/api/user`,
    // requestUrl: `http://${host}/${content}/api/user`,

    // 测试的信道服务地址1
    tunnelUrl: `https://${host}/${content}/api/tunnel`,

    // 测试的上传地址
    uploadUrl: `https://${host}/${content}/api/upload`,

    avatarUrl: `https://${host}/${content}/static/images/avatar/0.png`,
    reportSourceUrl: 'https://kf.bleege.com/api/mina_source/report',

    originalId: 'gh_ff474f6f5ce9',

    version: '1.0.2',
  },

  pixelRate: 0.5, //px与rpx换算关系
  platform: 'ios', //操作平台 用于适配胶囊高度
  capsuleHeight: 44, //胶囊高度
  statusBarHeight: 20, //手机顶部状态栏高度
  titleHeight: 136, //整个导航头高度
  systemHeight: 0, //手机屏幕高度
  isAllScreen: false, //是否是全面屏手机
  isHighHead: false, //是否是刘海屏手机
  windowWidth: 375,
  sampleRate: 44100,
  encodeBitRate: 64000,
};

module.exports = config;