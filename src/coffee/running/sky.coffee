World = require "../world"
Vector = require "../vector"
Circle = require "../circle"

class Sky extends World
	constructor: (@canvas) ->
		super
		
		@direction = new Vector 1, -@height / @width
		@quater = 3
		@depth = max: .4, min: .1
		@spawnDelay = 100
		@startAmount = 600

		do @bindEvents
		do @start

	startSpawn: -> @spawner = setInterval @createStar.bind(@), @spawnDelay
	stopSpawn: -> clearInterval @spawner

	startStack: ->
		for i in [0..@startAmount]
			@createStar new Vector Math.random() * @width, Math.random() * @height

	createStar: (position) ->
		half = Math.random() > .5
		depth = (Math.random() * (@depth.max - @depth.min) + @depth.min).toFixed 4

		if not position then switch @quater
			when 1
				if half then position = new Vector Math.floor(Math.random() * @width), -@threeshold
				else position = new Vector @width + @threeshold, Math.floor(Math.random() * @height)
			when 2
				if half then position = new Vector Math.floor(Math.random() * @width), -@threeshold
				else position = new Vector -@threeshold, Math.floor(Math.random() * @height)
			when 3
				if half then position = new Vector -@threeshold, Math.floor(Math.random() * @height)
				else position = new Vector Math.floor(Math.random() * @width), @height + @threeshold
			when 4
				if half then position = new Vector @width + @threeshold, Math.floor(Math.random() * @height)
				else position = new Vector Math.floor(Math.random() * @width), @height + @threeshold

		@objects.push new Circle @,
			position: position
			direction: @direction
			size: .5 + depth * 1.5
			opacity: depth
			speed: 1.25

	checkPosition: (i) ->
		o = @objects[i]
		switch @quater
			when 1
				o.position.x < -@threeshold or
				o.position.y > @height + @threeshold
			when 2
				o.position.x > @width + @threeshold or
				o.position.y > @height + @threeshold
			when 3
				o.position.x > @width + @threeshold or
				o.position.y < -@threeshold
			when 4
				o.position.x < -@threeshold or
				o.position.y < -@threeshold

	bindEvents: ->
		window.addEventListener "resize", => do @setSize
		# window.addEventListener "mousemove", (e) => @cursor new Vector e.pageX, e.pageY

	cursor: (position) ->
		@direction = do @center.copy().substract(position).direction
		if @direction.x >= 0
			if @direction.y >= 0 then @quater = 2
			else @quater = 3
		else
			if @direction.y >= 0 then @quater = 1
			else @quater = 4

	start: ->
		do @startSpawn
		do @startStack
		do @update

module.exports = Sky