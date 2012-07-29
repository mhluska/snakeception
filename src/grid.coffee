define ['pair', 'utils', 'world'], (Pair, Utils, World) ->

    class Grid extends World

        constructor: (@game, @squaresX = 25, @squaresY = 15) ->

            @graphics = null

            @squareWidth = 15
            @squareHeight = 15

            @foodItems = null

            @squareTypes = ['food', 'snake']

            @_world = null

        _squareToEdges: (pos) =>

            return if @squareHasType 'snake', pos

            edges = []
            @eachAdjacentPosition pos, (adjacentPos, direction) =>
                return if @squareHasType 'snake', adjacentPos
                edges.push [ pos.toString(), adjacentPos.toString() ]

            edges

        _unregisterAllTypesAt: (pos) ->
            @unregisterSquareAt pos, type for type in @squareTypes

        dropFood: (pos) =>

            pos ?= Utils.randPair @squaresX - 1, @squaresY - 1
            @game.foodItems.enqueue pos
            @game.foodItems.dequeue() if @foodCount > @maxFood

        makeWorld: ->
            @eachSquare (pos) => @_unregisterAllTypesAt pos
            @_world = ( ({} for [0...@squaresY]) for [0...@squaresX] )

        # Handles wrap around of pair coordinates on the game world
        moduloBoundaries: (pair) ->

            pair.x %= @squaresX
            pair.y %= @squaresY
            pair.x = @squaresX - 1 if pair.x < 0
            pair.y = @squaresY - 1 if pair.y < 0

            pair

        eachSquare: (callback) ->

            return unless @_world

            for column, x in @_world
                for square, y in column
                    pos = new Pair x, y
                    callback pos, square

        # Iterate over adjacent positions, taking into account wrap around
        eachAdjacentPosition: (pos, callback) ->

            positions =
                down:   new Pair pos.x, pos.y + 1
                right:  new Pair pos.x + 1, pos.y
                up:     new Pair pos.x, pos.y - 1
                left:   new Pair pos.x - 1, pos.y

            for direction, adjacentPos of positions
                normalizedPos = @moduloBoundaries adjacentPos
                return if false is callback normalizedPos, direction

        # squareAt(pos) returns key/value pairs of all the squares at pos.
        # squareAt(pos, type) returns the square at pos with type type.
        # squareAt(pos, type, value) sets the value of the square at pos with
        # type type.
        # Returns undefined if pos is out of bounds of the game world.
        squareAt: (pos, type, value) ->

          return @_world[pos.x][pos.y] if arguments.length is 1
          return @_world[pos.x][pos.y][type] if arguments.length is 2
          @_world[pos.x][pos.y][type] = value

        setup: (graphics) ->
            @graphics = graphics

        isEmptySquare: (square) ->

            for type in @squareTypes
                return false if square[type]
            true

        moveSquare: (start, end, type) ->

            @squareAt end, type, @squareAt start, type
            @squareAt start, type, null

        toGraph: ->

            graphEdges = []

            # TODO: Our graphEdges data structure has duplicate edges but it 
            # doesn't matter for now
            @eachSquare (pos) => Utils.concat graphEdges, @_squareToEdges pos
            graphEdges
