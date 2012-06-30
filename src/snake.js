(function() {

  if (window.Game == null) window.Game = {};

  Game.Snake = (function() {

    function Snake(length, direction, position) {
      var piece, x, y;
      this.length = length != null ? length : 5;
      this.direction = direction != null ? direction : 'down';
      this.position = position;
      this.grid = null;
      this.lastTailPos = null;
      this.moves = new Game.Queue([this.direction]);
      this.growthPerFood = 3;
      this.toGrow = 0;
      this.grown = 0;
      this.eating = false;
      if (this.position == null) this.position = new Game.Pair(0, 4);
      x = this.position.x;
      y = this.position.y;
      this.chain = (function() {
        var _ref, _results;
        _results = [];
        for (piece = 0, _ref = this.length - 1; 0 <= _ref ? piece <= _ref : piece >= _ref; 0 <= _ref ? piece++ : piece--) {
          _results.push(new Game.Pair(x, y - piece));
        }
        return _results;
      }).call(this);
      this.setupControls();
    }

    Snake.prototype.setup = function(grid) {
      var pair, _i, _len, _ref, _results;
      this.grid = grid;
      _ref = this.chain;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pair = _ref[_i];
        _results.push(this.grid.registerSquareAt(pair, 'snake'));
      }
      return _results;
    };

    Snake.prototype.setupControls = function() {
      var _this = this;
      return $(window).keydown(function(event) {
        var newDirection;
        newDirection = _this.direction;
        switch (event.keyCode) {
          case 37:
            newDirection = 'left';
            break;
          case 38:
            newDirection = 'up';
            break;
          case 39:
            newDirection = 'right';
            break;
          case 40:
            newDirection = 'down';
        }
        if (!_this.isOpposite(newDirection)) {
          return _this.moves.enqueue(newDirection);
        }
      });
    };

    Snake.prototype.isOpposite = function(newDirection) {
      var currentDirection;
      currentDirection = this.moves.peek() || this.direction;
      if (newDirection === 'left' && currentDirection === 'right') return true;
      if (newDirection === 'right' && currentDirection === 'left') return true;
      if (newDirection === 'up' && currentDirection === 'down') return true;
      if (newDirection === 'down' && currentDirection === 'up') return true;
      return false;
    };

    Snake.prototype.updateHeadPosition = function() {
      if (!this.moves.isEmpty()) this.direction = this.moves.dequeue();
      switch (this.direction) {
        case 'up':
          this.position.y -= 1;
          break;
        case 'right':
          this.position.x += 1;
          break;
        case 'down':
          this.position.y += 1;
          break;
        case 'left':
          this.position.x -= 1;
      }
      if (this.position.x < 0) this.position.x += this.grid.squaresX;
      this.position.x %= this.grid.squaresX;
      if (this.position.y < 0) this.position.y += this.grid.squaresY;
      return this.position.y %= this.grid.squaresY;
    };

    Snake.prototype.move = function() {
      var head, index, moveTo, piece, temp, _len, _ref;
      if (!this.direction) return;
      this.updateHeadPosition();
      head = this.chain[0];
      this.lastTailPos = this.chain[this.chain.length - 1].clone();
      temp = head.clone();
      moveTo = this.position.clone();
      if (this.grid.squareHasType('snake', moveTo)) this.grid.restart();
      _ref = this.chain;
      for (index = 0, _len = _ref.length; index < _len; index++) {
        piece = _ref[index];
        this.grid.moveSquare(piece, moveTo, 'snake');
        piece.copy(moveTo);
        moveTo.copy(temp);
        temp.copy(this.chain[index + 1]);
      }
      if (this.grid.squareHasType('food', head)) {
        this.toGrow += this.growthPerFood;
        this.eating = true;
      }
      if (this.eating) return this.eat();
    };

    Snake.prototype.eat = function() {
      if (!this.lastTailPos) return;
      this.chain.push(this.lastTailPos);
      this.grid.registerSquareAt(this.lastTailPos, 'snake');
      this.grid.unregisterFoodAt(this.chain[0]);
      this.grown += 1;
      if (this.grown === this.toGrow) {
        this.eating = false;
        this.toGrow = 0;
        return this.grown = 0;
      }
    };

    return Snake;

  })();

}).call(this);
