(function() {

  if (window.Game == null) window.Game = {};

  Game.Pair = (function() {

    function Pair(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
    }

    Pair.prototype.clone = function() {
      return new Game.Pair(this.x, this.y);
    };

    Pair.prototype.copy = function(pair) {
      if (!pair) return;
      this.x = pair.x;
      return this.y = pair.y;
    };

    Pair.prototype.equals = function(pair) {
      if (!pair) return false;
      return this.x === pair.x && this.y === pair.y;
    };

    Pair.prototype.toString = function() {
      return "(" + this.x + ", " + this.y + ")";
    };

    return Pair;

  })();

}).call(this);