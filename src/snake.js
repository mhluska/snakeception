// Generated by CoffeeScript 1.3.3
(function() {
  var _ref,
    __slice = [].slice;

  if ((_ref = window.Game) == null) {
    window.Game = {};
  }

  Game.Snake = (function() {

    function Snake(length, direction, head) {
      var piece, x, y, _ref1;
      this.length = length != null ? length : 5;
      this.direction = direction != null ? direction : 'down';
      this.head = head;
      this.grid = null;
      this.lastTailPos = null;
      this.moves = new Game.Queue([this.direction]);
      this.growthPerFood = 3;
      this.toGrow = 0;
      this.grown = 0;
      this.eating = false;
      this.seekingFood = false;
      if ((_ref1 = this.head) == null) {
        this.head = new Game.Pair(0, 4);
      }
      x = this.head.x;
      y = this.head.y;
      this.chain = (function() {
        var _i, _ref2, _results;
        _results = [];
        for (piece = _i = 0, _ref2 = this.length - 1; 0 <= _ref2 ? _i <= _ref2 : _i >= _ref2; piece = 0 <= _ref2 ? ++_i : --_i) {
          _results.push(new Game.Pair(x, y - piece));
        }
        return _results;
      }).call(this);
      this._setupControls();
    }

    Snake.prototype._updateHeadPosition = function() {
      if (!this.moves.isEmpty()) {
        this.direction = this.moves.dequeue();
      }
      switch (this.direction) {
        case 'up':
          this.head.y -= 1;
          break;
        case 'right':
          this.head.x += 1;
          break;
        case 'down':
          this.head.y += 1;
          break;
        case 'left':
          this.head.x -= 1;
      }
      if (this.head.x < 0) {
        this.head.x += this.grid.squaresX;
      }
      this.head.x %= this.grid.squaresX;
      if (this.head.y < 0) {
        this.head.y += this.grid.squaresY;
      }
      return this.head.y %= this.grid.squaresY;
    };

    Snake.prototype._setupControls = function() {
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
        if (!_this._isOpposite(newDirection)) {
          return _this.moves.enqueue(newDirection);
        }
      });
    };

    Snake.prototype._isOpposite = function(newDirection) {
      var currentDirection;
      currentDirection = this.moves.peek() || this.direction;
      if (newDirection === 'left' && currentDirection === 'right') {
        return true;
      }
      if (newDirection === 'right' && currentDirection === 'left') {
        return true;
      }
      if (newDirection === 'up' && currentDirection === 'down') {
        return true;
      }
      if (newDirection === 'down' && currentDirection === 'up') {
        return true;
      }
      return false;
    };

    Snake.prototype._eat = function() {
      if (!this.lastTailPos) {
        return;
      }
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

    Snake.prototype._findFoodPath = function() {
      var foodStrings, graph, pairs;
      graph = new Game.Graph(this.grid.toGraph());
      foodStrings = this.grid.foodItems._queue.map(function(item) {
        return item.toString();
      });
      pairs = graph.dijkstras.apply(graph, [this.head.toString()].concat(__slice.call(foodStrings)));
      pairs = pairs.map(function(pair) {
        return new Game.Pair(pair);
      });
      pairs.unshift(this.head);
      return this._pairsToDirections(pairs);
    };

    Snake.prototype._pairsToDirections = function(pairs) {
      var directions, index, pair, _i, _len;
      directions = [];
      for (index = _i = 0, _len = pairs.length; _i < _len; index = ++_i) {
        pair = pairs[index];
        if (index > 0) {
          directions.push(this.grid.pairOrientation(pairs[index - 1], pair));
        }
      }
      return directions;
    };

    Snake.prototype.setup = function(grid) {
      var pair, _i, _len, _ref1, _results;
      this.grid = grid;
      _ref1 = this.chain;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        pair = _ref1[_i];
        _results.push(this.grid.registerSquareAt(pair, 'snake'));
      }
      return _results;
    };

    Snake.prototype.move = function() {
      var head, index, moveTo, piece, temp, _i, _len, _ref1;
      if (!this.direction) {
        return;
      }
      head = this.head.clone();
      this._updateHeadPosition();
      this.lastTailPos = this.chain[this.chain.length - 1].clone();
      temp = head.clone();
      moveTo = this.head.clone();
      if (this.grid.squareHasType('snake', moveTo)) {
        this.grid.restart();
      }
      _ref1 = this.chain;
      for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
        piece = _ref1[index];
        this.grid.moveSquare(piece, moveTo, 'snake');
        piece.copy(moveTo);
        moveTo.copy(temp);
        temp.copy(this.chain[index + 1]);
      }
      if (this.grid.squareHasType('food', head)) {
        this.toGrow += this.growthPerFood;
        this.eating = true;
      }
      if (this.eating) {
        return this._eat();
      }
    };

    return Snake;

  })();

}).call(this);
