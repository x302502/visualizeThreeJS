import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Dock, Truck } from '../../common/models';
import '../../common/models/extension';
const OrbitControls = require('three-orbit-controls')(THREE);
@Injectable()
export class NewwarehouseService {

  // public global variables
  public idRenderer;
  public isPlay: boolean = true;
  public container: HTMLElement;
  public listTruck: Truck[] = [];
  //private global variables
  private WIDTH: number;
  private HEIGHT: number;
  private isShiftDown: Boolean = false;
  // Three global variables
  public scene: THREE.Scene;
  public controls: THREE.OrbitControls;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private mouse: THREE.Vector2;
  private raycaster: THREE.Raycaster;
  time = 0;
  private truckMaterials = [
    { name: 'container', url: 'assets/json/container.json', scale: 50, rotateY: 0 },
    { name: 'delivery', url: 'assets/json/delivery.json', scale: 10, rotateY: 270 },
    { name: 'lamborghini', url: 'assets/json/lamborghini.json', scale: 50, rotateY: 0 },
    { name: 'truck', url: 'assets/json/truck.json', scale: 50, rotateY: 0 },

  ]
  constructor() {
    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;
  }
  setSize() {
    this.WIDTH = (this.container.offsetLeft) ? window.innerWidth - this.container.offsetLeft : this.WIDTH;
    this.HEIGHT = (this.container.offsetTop) ? window.innerHeight - this.container.offsetTop : this.HEIGHT;
  }

  /**
  * inint scene and creat Ware house
  * @param sizeX width ware house
  * @param sizeZ depth ware house
  */
  makeScene(sizeX: number, sizeZ: number): void {
    this.setSize();
    /**
     * create Scene
     */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    // this.scene.fog = new THREE.Fog( 0xcce0ff, 1000, 10000 );
    /**
     * create Camera
     */
    this.camera = new THREE.PerspectiveCamera(40, this.WIDTH / this.HEIGHT, 1, 1000000);
    this.camera.position.set(sizeX, 100000, sizeZ);
    this.camera.lookAt(new THREE.Vector3(sizeX / 2, 800, sizeZ / 2));

    /**
     * create controls
     */

    this.controls = new OrbitControls(this.camera, this.container);
    // this.controls.target = new THREE.Vector3(sizeX / 2, 0, sizeZ / 2);

    /**
     * Mouse
     */

    this.mouse = new THREE.Vector2();

    /**
     * add lights
     */

    let ambientLight = new THREE.AmbientLight(0x606060);
    this.scene.add(ambientLight);
    let directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    this.scene.add(directionalLight);


    /**
     * create WebRenderer
     */
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.container.appendChild(this.renderer.domElement);
    /**
     * add Event
     */
    // this.container.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
    // this.container.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
    document.addEventListener('keydown', this.onDocumentKeyDown.bind(this), false);
    document.addEventListener('keyup', this.onDocumentKeyUp.bind(this), false);
    window.addEventListener('resize', this.onWindowResize.bind(this));

    /**
     * Raycaster
     */
    this.raycaster = new THREE.Raycaster();
    /**
     * create process
     */
   
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  animated() {
    if (!this.isPlay) {
      return;
    }
    this.idRenderer = requestAnimationFrame(this.animated.bind(this));
    this.controls.update();
    this.render();
  }
  onWindowResize() {
    this.setSize();
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
  }
  onDocumentKeyDown(event) {
    event.preventDefault();
    switch (event.keyCode) {
      case 16: this.isShiftDown = true; break;
    }
  }
  onDocumentKeyUp(event) {
    event.preventDefault();
    switch (event.keyCode) {
      case 16: this.isShiftDown = false; break;
    }
  }
  /**
   * 
   * @param keyAxis char = x,X or y,Y or z,Z
   * @param size length axis
   * @param color color axis type string
   */
  makeChildAxis(keyAxis: string, size: number, color: string) {
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({
      color: color,
      linewidth: 10,
      linecap: 'round',
      linejoin: 'round'
    });
    switch (keyAxis) {
      case 'x':
      case 'X':
        geometry.vertices.push(new THREE.Vector3(-size, 0, 0));
        geometry.vertices.push(new THREE.Vector3(size, 0, 0));
        break;
      case 'z':
      case 'Z':
        geometry.vertices.push(new THREE.Vector3(0, 0, -size));
        geometry.vertices.push(new THREE.Vector3(0, 0, size));
        break;
      case 'y':
      case 'Y':
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(0, size, 0));
      default:
        break;
    }
    var line = new THREE.LineSegments(geometry, material);
    this.scene.add(line);
  }
  makeLocationAxis() {
    this.makeChildAxis('x', 100000, 'blue');
    this.makeChildAxis('y', 100000, 'red')
    this.makeChildAxis('z', 100000, 'yellow')
  }

  /**
  * 
  * @param sizeX width house
  * @param sizeZ depth house
  * @param color color background number | string
  */
  makeBackground(sizeX: number, sizeZ: number, color: any) {
    let material = new THREE.MeshBasicMaterial({ color: color, opacity: 0.0, transparent: true });
    let geometry = new THREE.CubeGeometry(sizeX, 1, sizeZ);

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(sizeX / 2, -1, sizeZ / 2);
    this.scene.add(mesh);
    this.camera.position.set(sizeX, 50000, sizeZ);
    this.camera.lookAt(new THREE.Vector3(sizeX / 2, 800, sizeZ / 2));
    //this.controls.target = new THREE.Vector3(sizeX / 2, 0, sizeZ / 2);
  }
  makeRectangle(sizeX: number, sizeZ: number, color: any, marginX: number, marginZ: number, opacity: number, transparent: boolean) {
    let material = new THREE.MeshBasicMaterial({ color: color, opacity: opacity, transparent: transparent });
    let geometry = new THREE.CubeGeometry(sizeX, 1, sizeZ);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(marginX + sizeX / 2, 0, marginZ + sizeZ / 2);
    this.scene.add(mesh);
  }
  makeBacgroundWareHouse(sizeX: number, sizeZ: number, color: any, marginX: number, marginZ: number) {
    let material = new THREE.MeshBasicMaterial({ color: color, opacity: 0.5, transparent: false });
    let geometry = new THREE.CubeGeometry(sizeX, 1, sizeZ);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(marginX + sizeX / 2, 0, marginZ + sizeZ / 2);
    this.scene.add(mesh);
  }
  makeDock(dock: Dock) {
    let group = new THREE.Group()
    let material = new THREE.MeshBasicMaterial({ color: dock.color, opacity: 1, transparent: false });
    let geometry = new THREE.CubeGeometry(dock.sizeX, 1, dock.sizeZ);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(dock.marginX + dock.sizeX / 2, 0, dock.marginZ + dock.sizeZ / 2);
    group.add(mesh);
    let material1 = new THREE.MeshBasicMaterial({ color: 'black', opacity: 0.5, transparent: true });
    let geometry1 = new THREE.CubeGeometry(dock.sizeX, 10000, 1);
    let mesh1 = new THREE.Mesh(geometry1, material1);
    mesh1.position.set(dock.marginX + dock.sizeX / 2, 5000, dock.marginZ + dock.sizeZ);
    group.add(mesh1);
    let material2 = new THREE.MeshBasicMaterial({ color: 'black', opacity: 0.5, transparent: true });
    let geometry2 = new THREE.CubeGeometry(dock.sizeX, 10000, 1);
    let mesh2 = new THREE.Mesh(geometry1, material1);
    mesh2.position.set(dock.marginX + dock.sizeX / 2, 5000, dock.marginZ);
    group.add(mesh2);
    dock.group = group;
    this.scene.add(group);
  }
  makeListDock(list: Dock[]) {
    list.forEach((dock) => {
        this.makeDock(dock);
        dock.fixStatusDoor();
    })
  }
  makeTruck(tagId: number, typeTruck: string, x: number, y: number, z: number) {
    let item = this.truckMaterials.find(x => x.name === typeTruck);
    if (item) {
      let loader = new THREE.ObjectLoader();
      loader.load(item.url, (obj) => {
        let newObj = new THREE.Object3D;
        newObj.copy(obj);
        newObj.scale.set(item.scale, item.scale, item.scale);
        newObj.position.set(x, y, z);
        newObj.rotateY(Math.parseDegreesToRadian(item.rotateY))
        console.log(Math.parseRadianToDegrees(newObj.rotation.y))
        this.listTruck.push(new Truck(tagId, newObj));
        this.scene.add(newObj);
      },
        (xhr) => {
          console.log(xhr.loaded / xhr.total * 100 + '%');
        },
        (err) => console.log(err));

    }
  }
  runTruck(listDock: Dock[]) {
    return setInterval(() => {
      this.listTruck.forEach(truck => {
        truck.object.position.x += 1000;
      })
      listDock.forEach(dock => {
        dock.checkArea(this.listTruck);
        dock.fixStatusDoor();
      })
    }, 1000);
  }
}