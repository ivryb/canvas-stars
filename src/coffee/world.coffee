Vector = require "./vector"

class World
	constructor: (@canvas) ->
		do @setSize
		do @bindEvents
		@ctx = @canvas.getContext "2d"
		@threeshold = 50
		@objects = []

	setSize: ->
		@width = @canvas.width = window.innerWidth
		@height = @canvas.height = window.innerHeight
		@max = Math.max @width, @height
		@center = new Vector @width / 2, @height / 2

	removeObject: (i) ->
		@objects[i].removed = true
		@objects.splice i, 1

	update: ->
		requestAnimationFrame @update.bind @

		do @clear

		for i in [(@objects.length - 1)..0]
			if @objects[i]
				@objects[i].update i
				if @checkPosition i then @removeObject i

	checkPosition: (i) ->
		if @objects[i]
			@objects[i].position.x > @width + @threeshold or
			 @objects[i].position.x < -@threeshold or
			 @objects[i].position.y < -@threeshold or
			 @objects[i].position.y > @height + @threeshold
		else false

	clear: -> @ctx.clearRect 0, 0, @width, @height

	bindEvents: ->
		window.addEventListener "resize", => do @setSize

module.exports = World