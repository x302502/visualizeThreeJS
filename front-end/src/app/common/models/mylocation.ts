import * as THREE from 'three';
export class MyLocation {
    x: number;
    y: number;
    z: number;
    constructor(x: number,y: number,z: number, ) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    convertVector3(){
        return new THREE.Vector3(this.x,this.y,this.z);
    }
}