// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['game', 'cube', 'graphics3'], function(Game, Cube, Graphics3) {
    var Game3;
    return Game3 = (function(_super) {

      __extends(Game3, _super);

      function Game3(selector, settings) {
        if (settings == null) {
          settings = {};
        }
        Game3.__super__.constructor.call(this, selector, settings);
        this.maxFood = 24;
        this.grid = new Cube(this);
        this.graphics = new Graphics3(this, this.grid);
        this._startGame();
      }

      return Game3;

    })(Game);
  });

}).call(this);
