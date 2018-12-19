Vector = require "./vector"

class Circle
	constructor: (@context, config) ->
		@size = 5
		@color = "white"
		@stroke = null
		@opacity = 1
		@position = new Vector
		@direction = new Vector
		@speed = 0

		@[key] = config[key] for key of config if config

		@start = new Date() - 100000

	draw: ->
		do @context.ctx.beginPath

		@context.ctx.fillStyle = @color
		@context.ctx.strokeStyle = @stroke
		@context.ctx.globalAlpha = @opacity
		@context.ctx.arc @position.x, @position.y, @size, 0, Math.PI * 2
		if @color then do @context.ctx.fill
		if @stroke then do @context.ctx.stroke

		do @context.ctx.closePath

	update: ->
		@position.add @direction.scalar @speed * (new Date() - @start) / 1000000
		do @draw

module.exports = Circle