import { Injectable, HostListener } from '@angular/core';
import * as THREE from 'three';
import { MyLocation, CustomMesh } from '../../common/models';
const OrbitControls = require('three-orbit-controls')(THREE);
import { AppServices } from '../../app.services';
@Injectable()
export class VisualizeService {
  // variable makeScene
  public idRenderer;
  public container: HTMLElement;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private controls: THREE.OrbitControls;
  private mouse: THREE.Vector2;
  private plane: THREE.Mesh;
  private isShiftDown: Boolean = false;
  private raycaster: THREE.Raycaster;
  private WIDTH: number;
  private HEIGHT: number;
  private sizeX: number;
  private sizeZ: number;
  public listDataChildScene: DataChildScene[] = [];
  public listObject = [];
  public listRack = [];
  private selectedObj: THREE.Object3D;
  // data test 
  private group: THREE.Group;
  public keyTask: string;
  constructor(private appServices: AppServices) {
    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;
  }
  setSize() {
    this.WIDTH = window.innerWidth - this.container.offsetLeft;
    this.HEIGHT = window.innerHeight - this.container.offsetTop;
  }

  makeScene(): void {
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

    /**
     * create controls
     */

    this.controls = new OrbitControls(this.camera, this.container);


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
     * Raycaster
     */
    this.raycaster = new THREE.Raycaster();
    /**
 * add viewLocation
 */
    let viewLocation = document.createElement('div');
    viewLocation.style.position = 'absolute';
    viewLocation.style.top = '10px';
    viewLocation.style.width = '15%';
    viewLocation.style.right = '10px';
    viewLocation.style.color = '#0c1e27';
    viewLocation.innerHTML = 'No Data';
    viewLocation.style.padding = '10px';
    viewLocation.id = 'viewLocation';
    viewLocation.style.backgroundColor = 'white';
    viewLocation.style.boxShadow = '8px 9px 38px -9px rgba(0,0,0,0.42)';
    this.container.appendChild(viewLocation);
    /**
     * add Event
     */
    this.container.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
    this.container.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
    this.container.addEventListener('dblclick', this.onDocumentDBClick.bind(this), false);
    //document.addEventListener('keydown', this.onDocumentKeyDown.bind(this), false);
    //document.addEventListener('keyup', this.onDocumentKeyUp.bind(this), false);

    this.container.addEventListener('contextmenu', _ => this.onWDocumentRightClick());
    window.addEventListener('resize', _ => this.onWindowResize());
    //
    this.selectedObj = new THREE.Object3D();
    this.group = new THREE.Group();
  }

  setControlsAndCamera(sizeX: number, sizeZ: number) {
    this.camera.position.set(sizeX, 1000, sizeZ);
    this.camera.lookAt(new THREE.Vector3(sizeX / 2, 800, sizeZ / 2));
    this.controls.target = new THREE.Vector3(sizeX / 2, 0, sizeZ / 2);
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
  makeLocationAxis(size: number) {
    this.makeChildAxis('x', size, 'blue');
    this.makeChildAxis('y', size, 'red');
    this.makeChildAxis('z', size, 'yellow');
    this.setControlsAndCamera(size, size);
  }

  onWindowResize() {
    this.setSize();
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
  }
  onWDocumentRightClick() {
    alert('right click');
  }
  onDocumentDBClick(event: MouseEvent) {
    event.preventDefault();
    this.mouse.set(((event.clientX - this.container.offsetLeft + $(window).scrollLeft()) / this.WIDTH) * 2 - 1, - ((event.clientY - this.container.offsetTop + $(window).scrollTop()) / this.HEIGHT) * 2 + 1);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    switch (this.keyTask) {
      case 'rack':
        if (this.selectedObj) {
          this.selectedObj.children.forEach( item => {
            console.log(item.position);
          })
          let tempGroup = new THREE.Group();
          tempGroup.copy(this.selectedObj);
          this.scene.add(tempGroup);     
          console.log(tempGroup);    
          this.selectedObj = null;
        }
        this.keyTask = '';
        break;

      default:
        break;
    }
  }
  onDocumentMouseMove(event: MouseEvent) {
    event.preventDefault();
    this.mouse.set(((event.clientX - this.container.offsetLeft + $(window).scrollLeft()) / this.WIDTH) * 2 - 1, - ((event.clientY - this.container.offsetTop + $(window).scrollTop()) / this.HEIGHT) * 2 + 1);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    switch (this.keyTask) {
      case 'rack':
        let intersects = this.raycaster.intersectObjects(this.listObject);
        if (intersects.length > 0) {
          if (!this.selectedObj) {
            this.selectedObj = new THREE.Group();
          }
          this.selectedObj.position.copy(intersects[0].point);
          //this.selectedObj.position.copy(intersects[0].point.divide(new THREE.Vector3(1000,1000,1000)).floor().multiply(new THREE.Vector3(1000,1000,1000)).add(new THREE.Vector3(500,0,500)));
          console.log(intersects[0].point.floor())
        }
        break;

      default:
        break;
    }
  }
  onDocumentMouseDown(event: MouseEvent) {

  }
  onDocumentKeyDown(event) {
    event.preventDefault();
    console.log('key down');
    switch (event.keyCode) {

      case 16: this.isShiftDown = true; break;
    }
  }
  onDocumentKeyUp(event) {
    console.log('key up');
    event.preventDefault();
    switch (event.keyCode) {
      case 16: this.isShiftDown = false; break;
    }
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  animated() {

    this.idRenderer = requestAnimationFrame(this.animated.bind(this));
    this.controls.update();
    this.render();
  }
  /**
 * create backgroud Warre House
 * @param sizeX width
 * @param sizeZ depth
 */
  createBackgroudWareHouse(sizeX: number, sizeZ: number, color: any) {
    this.sizeX = sizeX;
    this.sizeZ = sizeZ;
    let geometry1 = new THREE.PlaneBufferGeometry(sizeX, sizeZ);
    geometry1.rotateX(- Math.PI / 2);
    //  geometry1.rotateY(- Math.PI/2);
    //  geometry1.rotateZ(- Math.PI/2);
    this.plane = new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial({ visible: false }));
    this.plane.position.set(sizeX / 2, 0, sizeZ / 2);
    this.scene.add(this.plane);
    this.listObject.push(this.plane);

    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({ color: color });
    let step = 500;

    for (let i = 0; i <= sizeZ; i += step) {
      geometry.vertices.push(new THREE.Vector3(0, -2, i));
      geometry.vertices.push(new THREE.Vector3(sizeX, -2, i));
    }
    for (let i = 0; i <= sizeX; i += step) {
      geometry.vertices.push(new THREE.Vector3(i, -2, 0));
      geometry.vertices.push(new THREE.Vector3(i, -2, sizeZ));
    }

    var line = new THREE.LineSegments(geometry, material);
    this.listDataChildScene.push(new DataChildScene('background', line.uuid));
    this.scene.add(line);
  }
  /**
   * 
   * @param size x,y,z size
   * @param location x,y,z center location
   */
  makeRackInOneBox(size: MyLocation, location: MyLocation,color: any) {
    let geometry = new THREE.Geometry();
    color = color || 'blue';
    let material = new THREE.LineDashedMaterial({
      color: color,
      linewidth: 100,
      scale: 1,
      dashSize: 100,
      gapSize: 0,
    });
    // draw bottom
    let arrPoint: THREE.Vector3[] = [];
    // A1
    let point = new THREE.Vector3(location.x - size.x / 2, location.y - size.y / 2, location.z - size.z / 2)
    arrPoint.push(point);
    // A2
    point = new THREE.Vector3(location.x + size.x / 2, location.y - size.y / 2, location.z - size.z / 2)
    arrPoint.push(point);
    // A3
    point = new THREE.Vector3(location.x + size.x / 2, location.y - size.y / 2, location.z + size.z / 2)
    arrPoint.push(point);
    // A4
    point = new THREE.Vector3(location.x - size.x / 2, location.y - size.y / 2, location.z + size.z / 2)
    arrPoint.push(point);
    // A5
    point = new THREE.Vector3(location.x - size.x / 2, location.y + size.y / 2, location.z + size.z / 2)
    arrPoint.push(point);
    // A6
    point = new THREE.Vector3(location.x + size.x / 2, location.y + size.y / 2, location.z + size.z / 2)
    arrPoint.push(point);
    // A7
    point = new THREE.Vector3(location.x + size.x / 2, location.y + size.y / 2, location.z - size.z / 2)
    arrPoint.push(point);
    // A8
    point = new THREE.Vector3(location.x - size.x / 2, location.y + size.y / 2, location.z - size.z / 2)
    arrPoint.push(point);
    // draw bottom
    for (let index = 0; index < 4; index++) {
      geometry.vertices.push(arrPoint[index]);
      geometry.vertices.push(arrPoint[(index + 1) % 4]);
    }
    // draw top
    for (let index = 0; index < 4; index++) {
      geometry.vertices.push(arrPoint[4 + index]);
      geometry.vertices.push(arrPoint[4 + (index + 1) % 4]);
    }
    // draw column
    for (let index = 0; index < 4; index++) {
      geometry.vertices.push(arrPoint[index]);
      geometry.vertices.push(arrPoint[7 - index]);
    }
    // draw diagonal line
    // for (let index = 0; index < 4; index++) {
    //   geometry.vertices.push(arrPoint[index]);
    //   geometry.vertices.push(arrPoint[index + 4]);
    // }
    // for (let index = 0; index < 2; index++) {
    //   geometry.vertices.push(arrPoint[index]);
    //   geometry.vertices.push(arrPoint[index + 2]);
    //   geometry.vertices.push(arrPoint[index + 4]);
    //   geometry.vertices.push(arrPoint[index + 6]);
    // }
    let line = new THREE.LineSegments(geometry, material);
    this.listDataChildScene.push(new DataChildScene('rack', line.uuid));
    return line;
  }
  makeRack(size: MyLocation, qtyRow: number,qtyHeight: number,qtyColumn: number,color: any) {
    let tempGroup = new THREE.Group();
    if (qtyColumn !== 0 && qtyRow !== 0 && qtyHeight !== 0) {
      for (let x = 0; x < qtyRow * size.x; x += size.x) {
        for (let z = 0; z < qtyColumn * size.z; z += size.z) {
          for (let y = size.y / 2; y < qtyHeight * size.y; y += size.y) {
            tempGroup.add(this.makeRackInOneBox(size, new MyLocation(x, y, z),color))
            //tempGroup.add(this.addBox(size,new MyLocation(x,y,z),'hehe'));
          }
        }
      }
      this.listDataChildScene.push(new DataChildScene('rack', tempGroup.uuid));
      this.listRack.push(tempGroup);
      this.selectedObj = tempGroup;
      this.scene.add(tempGroup);
    }
  }
  /**
   * 
   * @param size width,height,depth box
   * @param center location center box
   * @param name name box
   */
  addBox(size: MyLocation, center: MyLocation, name: string) {
    var rollOverGeo = new THREE.BoxGeometry(size.x, size.y, size.z);
    //let  material = new THREE.MeshBasicMaterial({ color: 0x1E9ACD, opacity: 1, transparent: true });
    let material = new THREE.MeshLambertMaterial({ color: 0xfeb74c, map: new THREE.TextureLoader().load("assets/img/visulalize/square-outline-textured.png") });
    let rollOverMesh = new THREE.Mesh(rollOverGeo, material);
    rollOverMesh.position.set(center.x, center.y, center.z);
    this.listDataChildScene.push(new DataChildScene('box', rollOverMesh.uuid));
    return rollOverMesh;
  }
  /**
   * 
   * @param size width,height,depth box
   * @param center location center box
   * @param name name box
   */
  addBoxTransparent(size: MyLocation, center: MyLocation, name: string) {
    let rollOverGeo = new THREE.BoxGeometry(1000, 1400, 1200);
    let rollOverMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, opacity: 0, transparent: true });
    let rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    rollOverMesh.position.set(center.x, center.y, center.z);
    this.listDataChildScene.push(new DataChildScene('box', rollOverMesh.uuid));
    return rollOverMesh;
  }
  removeChildren(key: string) {
    if (this.scene.children.length > 0) {
      let arr = this.listDataChildScene.filter(x => x.key === key);
      arr.forEach(item => {
        this.scene.remove(this.scene.children.find(x => x.uuid === item.uuid));
      })
      this.listDataChildScene = this.listDataChildScene.filter(x => x.key !== key);
    }
  }
}

class DataChildScene {
  key: string;
  uuid: string;
  constructor(key: string, uuid: string) {
    this.key = key;
    this.uuid = uuid;
  }
}