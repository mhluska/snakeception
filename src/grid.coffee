class SNAKE.Grid

    constructor: (@game, @snake, @squaresX = 25, @squaresY = 15) ->

        @graphics = null

        @squareWidth = 15
        @squareHeight = 15
        @squareTypes = ['food', 'snake']

        @maxFood = 4
        @foodCount = 0
        @foodItems = null

    _squareToEdges: (pos) =>

        return if @squareHasType('snake', pos) and not pos.equals @snake.head

        edges = []
        @eachAdjacentPosition pos, (adjacentPos, direction) =>
            return if @squareHasType 'snake', adjacentPos
            edges.push [ pos.toString(), adjacentPos.toString() ]

        edges

    # Handles wrap around of pair coordinates on the game world
    moduloBoundaries: (pair) ->

        pair.x %= @squaresX
        pair.y %= @squaresY
        pair.x = @squaresX - 1 if pair.x < 0
        pair.y = @squaresY - 1 if pair.y < 0

        pair

    eachSquare: (callback) ->

        return unless @world

        for column, x in @world
            for square, y in column
                pos = new SNAKE.Pair x, y
                callback pos, square

    # Iterate over adjacent positions, taking into account wrap around
    eachAdjacentPosition: (pos, callback) ->

        positions =
            down:   new SNAKE.Pair pos.x, pos.y + 1
            right:  new SNAKE.Pair pos.x + 1, pos.y
            up:     new SNAKE.Pair pos.x, pos.y - 1
            left:   new SNAKE.Pair pos.x - 1, pos.y

        for direction, adjacentPos of positions
            normalizedPos = @moduloBoundaries adjacentPos
            return if false is callback normalizedPos, direction

    makeWorld: ->
        @eachSquare (pos) => @unregisterAllSquaresAt pos
        @world = ( ({} for [0...@squaresY]) for [0...@squaresX] )

    setup: (graphics) ->
        @graphics = graphics

    moveSquare: (start, end, type) ->

        @world[end.x][end.y][type] = @world[start.x][start.y][type]
        @world[start.x][start.y][type] = null

    isEmptySquare: (square) ->

        for type in @squareTypes
            return false if square[type]
        true

    registerSquareAt: (pos, type) ->
        return false if @world[pos.x][pos.y][type]
        @world[pos.x][pos.y][type] = true
        true

    registerFoodAt: (pos) ->
        return false unless @registerSquareAt pos, 'food'
        @foodCount += 1
        true

    unregisterSquareAt: (pos, type) ->

        return false unless @world[pos.x][pos.y][type]

        # The square will float around invisible until the graphics module
        # decides to clean it up
        # TODO: Make a queue to keep track of these hidden nodes and garbage 
        # collect them after a while or after game over
        @world[pos.x][pos.y][type]?.hide()
        @world[pos.x][pos.y][type] = null
        true

    unregisterFoodAt: (pos) ->
        return false unless @unregisterSquareAt pos, 'food'
        @foodCount -= 1
        true

    unregisterAllSquaresAt: (pos) ->
        @unregisterSquareAt pos, type for type in @squareTypes

    squareHasType: (type, pos) -> @world[pos.x][pos.y][type]?

    squareHasFood: (pos) ->
        @squareHasType 'food', pos

    dropFood: =>

        @foodItems.enqueue SNAKE.Utils.randPair @squaresX - 1, @squaresY - 1
        @foodItems.dequeue() if @foodCount > @maxFood

    # Uses Euclidean distance to find the nearest food item to source
    # TODO: This function doesn't return the correct answer in 2D mode due to
    # wrap around.
    # TODO: The answer is also incorrect because we are getting distance to
    # top left corner. We need smallest distance to snake head. So create a
    # 2Vector class which extends Pair. Move distance function to 2Vector. Add
    # math functions like Add and Subtract. Then subtract snake head from food
    # vector and take the Euclidean distance
    closestFood: (source) ->
        # TODO: Dont iterate the damn queue. Use the more general linked list
        closestPos = null
        for pos in @foodItems._queue
            @game.log "iterating #{pos}"
            if @graphics.visible @world[pos.x][pos.y].food
                @game.log "checking #{pos}"
                @game.log "pos distance: #{pos.distance()}, source distance: #{source.distance()}"
                if closestPos is null or pos.distance() < closestPos.distance()
                    closestPos = pos

        closestPos

    toGraph: ->

        graphEdges = []

        # TODO: Our graphEdges data structure has duplicate edges but it 
        # doesn't matter for now
        @eachSquare (pos) => SNAKE.Utils.concat graphEdges, @_squareToEdges pos
        graphEdges
