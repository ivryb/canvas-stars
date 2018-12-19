class Vector
	constructor: (x, y) ->
		@x = x ? 0
		@y = y ? 0
	add: (vec) ->
		@x += vec.x
		@y += vec.y
		@
	substract: (vec) ->
		@x -= vec.x
		@y -= vec.y
		@
	scalar: (n) -> new Vector @x * n, @y * n
	direction: ->
		max = Math.max(Math.abs(@x), Math.abs(@y))
		new Vector @x / max, @y / max
	copy: -> new Vector @x, @y
	@distance: (v1, v2) ->
		Math.sqrt Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2)

module.exports = Vector