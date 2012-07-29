// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['grid', 'graph', 'utils', 'world'], function(Grid, Graph, Utils, World) {
    var Cube;
    return Cube = (function(_super) {

      __extends(Cube, _super);

      function Cube(game, length) {
        var index;
        this.game = game;
        this.length = length != null ? length : 15;
        this._world = (function() {
          var _i, _results;
          _results = [];
          for (index = _i = 0; _i <= 5; index = ++_i) {
            _results.push(new Grid(game, this.length, this.length));
          }
          return _results;
        }).call(this);
        this.cubeGraph = new Graph([[this._world[2], this._world[0]], [this._world[2], this._world[1]], [this._world[2], this._world[3]], [this._world[2], this._world[5]], [this._world[3], this._world[4]]]);
      }

      Cube.prototype.registerSquareAt = function() {};

      Cube.prototype.dropFood = function() {
        var index;
        index = Utils.randInt(0, 5);
        return this._world[index].dropFood();
      };

      Cube.prototype.squareAt = function(pos, type, value) {
        return this._world[pos.faceIndex].squareAt(pos, type, value);
      };

      return Cube;

    })(World);
  });

}).call(this);
