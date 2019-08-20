const THREE = require('../../../utils/three');
const Pen = require('./Pen');
/**
 * 转盘
 */
class TurnTable extends THREE.Group {
    static penTexture = null;
    static getTexture(canvas) {
        if (Pen.penTexture) {
            return Pen.penTexture
        }
        Pen.penTexture = new THREE.TextureLoader().load(canvas, '/UV_Grid_Sm.jpg');
        return Pen.penTexture
    }
    canvas = null;
    // type = 'table';
    constructor(canvas) {
        super()

        this.canvas = canvas;
        this.drawTurnTable();
    }

    drawTurnTable() {
        // 纹理
        let circleTexture = TurnTable.getTexture(this.canvas);
        let material = new THREE.MeshBasicMaterial({ map: circleTexture });
        // 圆
        let geometry = new THREE.CircleGeometry(100, 64);

        let turnTable = new THREE.Mesh(geometry, material);
        turnTable.name = 'table';
        turnTable.position.set(0, 0, 0);
        this.radius = 100;
        this.add(turnTable);

        this.position.y = 200;


        // console.log(this.position);
    }
}

module.exports = TurnTable;