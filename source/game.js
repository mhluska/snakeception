'use strict';

var THREE = require('three');
var World = require('./world.js');
var Snake = require('./snake.js');

module.exports = class Game {
  constructor(container) {
    this.container = container;

    this._setupScene();
    this._steps = 0;
    this._world = new World();
    this._snake = new Snake(this._world);
    this._dummyMesh = this._addDummyMesh();

    window.addEventListener('resize', this._updateScreenSize.bind(this));
    window.addEventListener('keydown', this._updateSnakeDirection.bind(this));
  }

  run() {
    console.log(this.container);
    this._animate();
  }

  _setupScene() {
    this.scene    = new THREE.Scene();
    this.camera   = new THREE.PerspectiveCamera(75, null, 1, 10000);
    this.renderer = new THREE.WebGLRenderer();

    this.camera.position.z = 1000;
    this._updateScreenSize();
    this.container.appendChild(this.renderer.domElement);
  }

  _updateScreenSize() {
    var width  = this.container.clientWidth;
    var height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  _updateSnakeDirection(event) {
    var direction = { 38: 'up', 39: 'right', 40: 'down', 37: 'left' }[event.keyCode];
    this._snake.direction = direction;
  }

  _addDummyMesh() {
    var geometry = new THREE.BoxGeometry(200, 200, 200);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    var mesh     = new THREE.Mesh(geometry, material);

    this.scene.add(mesh);

    return mesh;
  }

  _animate() {
    requestAnimationFrame(() => this._animate());

    if (this._steps % 5 === 0) {
      this._snake.move();
    }

    console.log(this._snake.position, this._snake.face, this._snake.direction);

    this._dummyMesh.rotation.x += 0.01;
    this._dummyMesh.rotation.y += 0.02;

    this.renderer.render(this.scene, this.camera);
  }
};
