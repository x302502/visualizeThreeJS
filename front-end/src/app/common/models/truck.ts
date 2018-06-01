export class Truck {
    tagId: number;
    object: THREE.Object3D
    constructor(tagId: number,object: THREE.Object3D){
        this.tagId = tagId;
        this.object = object;
    }
}