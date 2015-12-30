'use strict';

var THREE = require('three');
var World = require('./world.js');
var Voxel = require('./voxel.js');
var Utils = require('./utils');

module.exports = class Snake {
  constructor(world, camera) {
    this.world = world;

    // Possible positions are on a 2D array of size (N-1)x(N-1) for game size N.
    this.position = [Math.floor(World.GAME_SIZE/ 2), Math.floor(World.GAME_SIZE / 4)];
    this.prevPosition = null;

    // Possible faces are [0, 1, 2, 3, 4, 5, 6].
    this.face = 3;
    this.prevFace = null;

    // Default snake size.
    this.size = 4;
    this.mesh = this._makeMesh(this.size, this.position);

    this._head = this.mesh.children[0];

    // Possible directions are ['up', 'right', 'down', 'left'].
    this._direction = 'up';
    this._camera = camera;
  }

  get direction() {
    return this._direction;
  }

  set direction(val) {
    if (!['up', 'right', 'down', 'left'].includes(val)) return;
    if (['up', 'down'].includes(val) && ['up', 'down'].includes(this._direction)) return;
    if (['left', 'right'].includes(val) && ['left', 'right'].includes(this._direction)) return;

    this._direction = val;
  }

  move(newFaceCallback) {
    this.prevPosition = this.position;

    let prevFace = this.face;
    let outside  = this.world.nextPosition(this.direction, this.position);

    if (outside) {
      this.face = this.world.nextFace(this.direction, this._camera);
    }

    if (prevFace === this.face) {
      this._updateMeshPosition();
    } else {
      this.prevFace = prevFace;
      this._updateMeshPosition();
      newFaceCallback(this.prevFace, this.face, this.direction);
      this._updateMeshPosition();
    }
  }

  _makeMesh(size, position) {
    let group = new THREE.Object3D();
    let position3 = World.position2to3(position);

    position3[1] += (size + 1) * Voxel.SIZE;

    Utils.times(size, () => {
      group.add(new Voxel(position3).mesh);
      position3[1] -= Voxel.SIZE;
    });

    return group;
  }

  _updateMeshPosition() {
    if (![this.mesh.position, this._direction, this._camera].every(Boolean)) {
      throw new Error('Position, direction or camera are not initialized.');
    }

    let lastPosition = this._head.position.clone();
    this.world.updateMeshPosition(this._head.position, this._direction, this._camera);

    for (let i = 1; i < this.size; i += 1) {
      let piece = this.mesh.children[i];
      let tempPosition = piece.position.clone();
      piece.position.copy(lastPosition);
      lastPosition = tempPosition;
    }
  }
};
