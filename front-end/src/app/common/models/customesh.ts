import * as THREE  from 'three';
export class CustomMesh extends THREE.Mesh {
    public curentHex?: number = 0;
    constructor() {
      super();
    }
  }