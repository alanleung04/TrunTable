const THREE = require('../../../utils/three');
const ray = new THREE.Raycaster();
class Pen extends THREE.Group {
    canvas = null;
    move = false;
    main = null;
    fall = false;
    static penTexture = null;
    static getTexture(canvas) {
        if (Pen.penTexture) {
            return Pen.penTexture
        }
        Pen.penTexture = new THREE.TextureLoader().load(canvas, '/UV_Grid_Sm.jpg');
        return Pen.penTexture
    }
    constructor(canvas, main) {
        super();
        this.main = main;
        this.canvas = canvas;
        // console.log('here');
        this.drawPen();
    }

    clone() {
        return super.clone(false);
    }
    pen = null;
    drawPen() {

        let material = new THREE.MeshBasicMaterial({ map: Pen.getTexture(this.canvas) });
        let geometry = new THREE.PlaneGeometry(20, 60);
        let pen = new THREE.Mesh(geometry, material);
        this.pen = pen;
        pen.name = 'pen';
        this.add(pen);
        // this.matrixAutoUpdate = true;
        this.position.set(0, -400, -1);
    }

    reset(main, canvas, deg) {
        this.main = main;
        this.canvas = canvas;
        this.position.set(0, -400, -1);
        // let deg = this.position.z
        // console.log('deg', deg);
        this.rotateZ(deg);
        // this.quaternion.z = 0;
        // console.log(this);
        // this.quaternion;
        // this.rotation = rotation;
    }

    flyPen(object) {
        if (this.fall) {
            this.fallPen();
            return;
        }
        if (this.move) {
            this.position.y += 35;
            // 检测碰撞
            this.crashTest(object);

            // if (this.position.y > 0) {
            //     this.move = false;
            //     // this.main.penFlySuccess(100);
            // }
        }
    }

    fallPen() {
        // console.log('fall');
        this.position.y -= 35;
        if (this.position.y == -500) {
            this.fall = false;
        }
    }

    // 碰撞检查
    crashTest(object) {
        let originPoint = this.position.clone();
        originPoint.z = 100;
        // console.log(object);
        // return;
        ray.near = 0;
        for (let posIndex = 0; posIndex < this.pen.geometry.vertices.length; posIndex++) {
            let localVertex = this.pen.geometry.vertices[posIndex].clone();
            let globalVertex = localVertex.applyMatrix4(this.pen.matrix);
            let pen_pos = this.pen.position.clone();
            pen_pos.z = 100;
            let directionVector = globalVertex.sub(pen_pos);

            ray.set(originPoint, directionVector.clone().normalize())

            let result = ray.intersectObjects(object.children, true)

            // console.log(result);
            if (result.length > 0) {
                this.move = false;

                if (result[0].object.name == 'table') {
                    this.main.penFlySuccess(result[0].distance);
                } else {
                    this.main.penFlyFail();
                }
                break;
            }
        }
    }
}

module.exports = Pen;