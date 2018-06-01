import * as THREE from 'three';
import { Truck } from '.';

export class Dock {
  name: string;
  sizeX: number;
  sizeZ: number;
  color: any;
  marginX: number;
  marginZ: number;
  isOpen: boolean = true;
  group?: THREE.Group;
  constructor(name: string, sizeX: number, sizeZ: number, marginX: number, marginZ: number, color: any) {
    this.name = name
    this.sizeX = sizeX;
    this.sizeZ = sizeZ;
    this.color = (color) ? color : 'white';
    this.marginX = marginX;
    this.marginZ = marginZ;
  }

  closeDoor() {
    if (this.group.children.length <= 3) {
      let material = new THREE.MeshBasicMaterial({ color: 'blue', opacity: 1, transparent: true });
      let geometry = new THREE.CubeGeometry(1, 10000, this.sizeZ);
      let mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(this.marginX, 5000, this.marginZ + this.sizeZ / 2);
      this.group.add(mesh);
    }
  }
  openDoor() {
    if (this.group.children.length > 3) {
      this.group.children.pop();
    }
  }
  checkArea(listTruck: Truck[]) {
    for (let index = 0; index < listTruck.length; index++) {
      if ((listTruck[index].object.position.x > this.marginX + 2000)
        && (listTruck[index].object.position.z > this.marginZ + 1000)
        && (listTruck[index].object.position.z < this.marginZ - 1000 + this.sizeZ)
        && (listTruck[index].object.position.x < this.marginX + 2000 + this.sizeX)
      ) {
        this.isOpen = false;
        return;
      }
    }
    this.isOpen = true;
  }
  fixStatusDoor() {
    if(this.isOpen){
      this.openDoor()
    } else {
      this.closeDoor();
    }
  }
}
