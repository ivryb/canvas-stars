World = require "../world"
Vector = require "../vector"
Circle = require "../circle"

random = (min, max) ->
	Math.random() * (max - min) + min

class Sky extends World
	constructor: ->
		super

		@spawnDelay = 2000
		@lineSize = 250
		@maxLines = 3
		@startAmount = 25

		do @start

	startSpawn: -> @spawner = setInterval @createStar.bind(@), @spawnDelay

	randomStart: ->
		switch Math.floor Math.random() * 4
			when 0
				position: new Vector Math.floor(Math.random() * @width), -@threeshold
				direction: new Vector random(-1, 1), 1
			when 1
				position: new Vector Math.floor(Math.random() * @width), @height + @threeshold
				direction: new Vector random(-1, 1), -1
			when 2
				position: new Vector -@threeshold, Math.floor(Math.random() * @height)
				direction: new Vector 1, random(-1, 1)
			when 3
				position: new Vector @width + @threeshold, Math.floor(Math.random() * @height)
				direction: new Vector -1, random(-1, 1)

	createStar: (position) ->
		start = do @randomStart
		@objects.push new Star @,
			position: position ? start.position
			direction: start.direction
		do @udpateIndex

	startStack: ->
		for i in [0..@startAmount]
			@createStar new Vector Math.random() * @width, Math.random() * @height

	createLine: (p1, p2) -> @objects.push new Line @, p1, p2

	udpateIndex: ->
		@index += 1
		if @index >= 3000 then @index = 0

	start: ->
		@index = 0
		do @startSpawn
		do @startStack
		do @update

class Star extends Circle
	constructor: ->
		super
		@opacity = .65
		@speed = 1.5
		@size = 1.5
		@index = @context.index
		@relations = []
		@length = 0

	update: (i) ->
		super
		@check i

	check: (i) ->
		for j in [0...i]
			if @context.objects[j] instanceof Circle and not @relations[@context.objects[j].index]
				if @length < @context.maxLines and @context.objects[j].length < @context.maxLines
					if @context.lineSize > Vector.distance(@context.objects[j].position, @position)
						@relations[@context.objects[j].index] = true
						@context.objects[j].relations[@index] = true
						@length += 1
						@context.objects[j].length += 1
						@context.createLine @, @context.objects[j]

class Line
	constructor: (@context, @star1, @star2) ->
		do @setDistance
		@position = new Vector
		@lineSize = @context.lineSize
		@stroke = "white"
		@opacity = 0
		@start = new Date()
		
	draw: ->
		do @context.ctx.beginPath

		@context.ctx.strokeStyle = @stroke
		@context.ctx.globalAlpha = @opacity
		@context.ctx.moveTo @star1.position.x, @star1.position.y
		@context.ctx.lineTo @star2.position.x, @star2.position.y
		do @context.ctx.stroke

		do @context.ctx.closePath

	update: (i) ->
		do @draw
		do @setDistance
		if @start
			if @opacity < (@lineSize - @distance) / 500
				@opacity = Math.min (new Date() - @start) / 5000, (@lineSize - @distance) / 500
			else @start = null
		else @opacity = (@lineSize - @distance) / 500
		if @distance > @lineSize or @star1.removed and @star2.removed then @remove i

	setDistance: -> @distance = Vector.distance(@star1.position, @star2.position)

	remove: (i) ->
		@context.removeObject i
		@star1.relations[@star2.index] = null
		@star2.relations[@star1.index] = null
		@star1.length -= 1
		@star2.length -= 1

module.exports = Sky