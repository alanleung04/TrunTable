const app = getApp();
const THREE = require('../../../utils/three');
const TurnTable = require('./TurnTable');
const Pen = require('./Pen');
var requestAnimationFrame;
class GameMain {
    canvas = null
    constructor(canvas) {
        this.canvas = canvas;
        requestAnimationFrame = canvas.requestAnimationFrame;
        this.init(canvas);
        this.animate();
    }

    // 镜头
    camera = null;
    // 场景
    scene = null;
    // 灯光
    light = null;

    // 渲染器
    renderer = null;

    // 转盘
    turnTable = null;

    // 主场景
    mainObj = null;

    init(canvas) {

        // this.camera = new THREE.PerspectiveCamera()
        // 2d画面，直接用正交相机
        this.camera = new THREE.OrthographicCamera(canvas.width / -2, canvas.width / 2, canvas.height / 2, canvas.height / -2, 1, 500);
        // 设置相机位置
        this.camera.position.set(0, 0, 4);
        // 创建场景
        this.scene = new THREE.Scene();
        // 设置背景色
        this.scene.background = new THREE.Color(0xffffff);
        // 设置灯光
        this.light = new THREE.PointLight(0xff0000, 1, 0);
        this.light.position.set(200, 200, 200);
        // 将灯光添加到场景
        this.scene.add(this.light);

        // 转盘
        this.turnTable = new TurnTable(canvas);
        // group
        this.mainObj = new THREE.Group();
        this.mainObj.add(this.turnTable);
        this.scene.add(this.mainObj);


        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antalias: true });
        this.renderer.setSize(canvas.width, canvas.height);
        this.addPen()
    }

    clear() {

        this.scene.remove(this.mainObj);
        // this.scene.dispose();
        this.mainObj = null;
        this.turnTable = null;
        this.pen = null;
        if (this.gameStatus == 'fail') {
            this.restart()
        } else {
            this.gameStatus = 'restart'
        }

    }

    restart() {
        // 转盘
        this.gameStatus = 'start'
        this.turnTable = new TurnTable(this.canvas);
        // group
        this.mainObj = new THREE.Group();
        this.mainObj.add(this.turnTable);
        this.scene.add(this.mainObj);
        this.addPen()

        // this.animate();
    }

    // 碰撞一起转
    penFlySuccess(dis) {
        this.pen.move = false;
        this.turnTable.add(this.pen);
        // console.log('turnTable', this.turnTable.rotation.z);
        // console.log(-Math.cos(this.turnTable.rotation.z) * this.turnTable.radius);

        let deg = this.turnTable.rotation.z;
        dis = this.turnTable.radius + 15;
        console.log('dis', dis);
        this.pen.rotateZ(-deg);
        this.pen.position.x = -Math.sin(this.turnTable.rotation.z) * dis;
        // this.pen.position.y = -this.turnTable.radius;
        this.pen.position.y = this.pen.position.x * Math.cos(deg) / Math.sin(deg);
        // this.pen.position.y = -this.turnTable.radius;
        this.addPen(deg);
    }

    penFlyFail() {
        this.gameStatus = 'fail';
        this.pen.fall = true;
        this.pen.move = false;
        wx.showToast({
            title: 'gameover'
        })
    }

    gameStatus = 'start'

    // 动画
    animate() {




        let self = this;
        requestAnimationFrame(() => {
            // console.log(this);
            this.animate();
        });

        this.render();
    }

    render() {
        if (this.pen) {
            this.pen.flyPen(this.turnTable);
        }

        if (this.gameStatus == 'restart') {
            this.restart();
            return;
        }
        if (this.gameStatus == 'start') {
            if (this.turnTable) {
                this.turnTable.rotateZ(0.05);
            }
        }


        // 弧度deg

        // this.pen.rotateZ(0.02);
        // console.log(this.turnTable.position)
        // this.turnTable.translateZ(0.02);
        // this.turnTable.position.x += 1;
        this.renderer.render(this.scene, this.camera);
    }

    // 
    pen = null;
    penList = [];
    // 加刀

    addPen(deg = 0) {
        if (this.pen) {
            let pen = this.pen.clone()
            this.pen = pen;
            this.pen.reset(this, this.canvas, deg);
            this.mainObj.add(this.pen);
            return;
        }
        this.pen = new Pen(this.canvas, this);
        this.mainObj.add(this.pen);
        // this.penList.push(this.pen);
    }

    // 飞刀
    makePenFly() {
        this.pen.move = true;
    }
}

module.exports = GameMain;