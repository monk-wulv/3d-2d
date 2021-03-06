import * as THREE from 'three';
import { Trigger } from "../inner/trigger"
import { View } from './view';
import { Model } from '../model/model';
import * as Util from '../inner/util';
import { DefaultInteraction } from '../interactions/DefaultInteraction';

/**
 *
 *
 * @export
 * @class View
 * @extends {Trigger}
 */
export class View2D extends View {
    constructor(parentOrString, options) {
        super(parentOrString, options);
        this._debug = {
            /** 
             * @see https://github.com/jeromeetienne/threejs-inspector
             * @see https://chrome.google.com/webstore/detail/threejs-inspector/dnhjfclbfhcbcdfpjaeacomhbdfjbebi
            */
            inspector: options.debug && options.debug.inspector || false,
        };
        this._model = new Model();
        this.initWebGL();
        this.setDefaultInteraction();
        this.render();

    }

    /**
     * 初始化ThreeJS WebGL
     *
     * @memberof View
     */
    initWebGL() {
        if (!this.parent) {
            console.error('no parent div!');
        }
        let SCREEN_WIDTH = this.parent.offsetWidth, SCREEN_HEIGHT = this.parent.offsetHeight;

        // init renderer
        let renderer = this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
        });
        renderer.setClearColor(0x414141, 1);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.autoClear = true;
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.parent.appendChild(renderer.domElement);

        let scene = this._model.scene;
        if (Util.DEBUG) {
            window.scene = this._model && this._model.scene;
        }

        // init camera
        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;


        let camera = this.camera = new THREE.OrthographicCamera(-SCREEN_WIDTH / 2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, -SCREEN_HEIGHT / 2);

        let viewport = this.calViewport();
        // let camera = this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        camera.position.set(0, 150, 400);
        camera.lookAt(scene.position);
        scene.add(camera);

        // init LIGHT
        let light = this.light = new THREE.PointLight(0xffffff);
        light.position.set(-100, 150, 100);
        scene.add(light);

        // FLOOR
        let floorTexture = new THREE.TextureLoader().load("./images/checkerboard.jpg");
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(10, 10);
        let floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
        let floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
        let floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -0.5;
        floor.rotation.x = Math.PI / 2;
        scene.add(floor);

        // SKYBOX/FOG
        let skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
        let skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.DoubleSide });
        let skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
        scene.add(skyBox);

        scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);

        // CUSTOM //
        let cubeGeometry = new THREE.CubeGeometry(50, 50, 50);
        let cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true, opacity: 1 });
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0, 25, 0);
        scene.add(cube);

        let axes = new THREE.AxisHelper(1000);
        scene.add(axes);
    }

    /**
     * 安装默认交互事件
     *
     * @memberof View2D
     */
    setDefaultInteraction() {
        let defaultInteraction = new DefaultInteraction(this.camera, this.parent);
        defaultInteraction.target.x = this.camera.position.x;
        defaultInteraction.target.y = this.camera.position.y;
        defaultInteraction.target.z = 0;
        defaultInteraction.enableRotate = false;
        defaultInteraction.zoomSpeed = 2;
        defaultInteraction.noRotate = true;
        defaultInteraction.reset();
        this.defaultInteraction = defaultInteraction;
    }

    /**
     * 计算Viewport信息
     *
     * @memberof View2D
     */
    calViewport() {
        return {};
    }
    /**
     * render
     */
    render() {
        let renderer = this.renderer, camera = this.camera, scene = this._model.scene;
        requestAnimationFrame(() => {
            this.render();
        });
        renderer.render(scene, camera);
        this.update();
    }

    update() {
        // console.log('update');
    }

    /**
     *处理mosuedown 事件
     *
     * @memberof Markup
     */
    handle_mousedown(e) {
        console.log('view2d:', e);
    }


    handle_mousewheel(e) {
        console.log('view2d:', e);
        console.log(this.defaultInteraction.handleMouseWheel(e));
    }
}