(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Circle, Vector;

Vector = require("./vector");

Circle = (function() {
  function Circle(context, config) {
    var key;
    this.context = context;
    this.size = 5;
    this.color = "white";
    this.stroke = null;
    this.opacity = 1;
    this.position = new Vector;
    this.direction = new Vector;
    this.speed = 0;
    if (config) {
      for (key in config) {
        this[key] = config[key];
      }
    }
    this.start = new Date() - 100000;
  }

  Circle.prototype.draw = function() {
    this.context.ctx.beginPath();
    this.context.ctx.fillStyle = this.color;
    this.context.ctx.strokeStyle = this.stroke;
    this.context.ctx.globalAlpha = this.opacity;
    this.context.ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
    if (this.color) {
      this.context.ctx.fill();
    }
    if (this.stroke) {
      this.context.ctx.stroke();
    }
    return this.context.ctx.closePath();
  };

  Circle.prototype.update = function() {
    this.position.add(this.direction.scalar(this.speed * (new Date() - this.start) / 1000000));
    return this.draw();
  };

  return Circle;

})();

module.exports = Circle;


},{"./vector":5}],2:[function(require,module,exports){
var Circle, Line, Sky, Star, Vector, World, random,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

World = require("../world");

Vector = require("../vector");

Circle = require("../circle");

random = function(min, max) {
  return Math.random() * (max - min) + min;
};

Sky = (function(superClass) {
  extend(Sky, superClass);

  function Sky() {
    Sky.__super__.constructor.apply(this, arguments);
    this.spawnDelay = 2000;
    this.lineSize = 250;
    this.maxLines = 3;
    this.startAmount = 25;
    this.start();
  }

  Sky.prototype.startSpawn = function() {
    return this.spawner = setInterval(this.createStar.bind(this), this.spawnDelay);
  };

  Sky.prototype.randomStart = function() {
    switch (Math.floor(Math.random() * 4)) {
      case 0:
        return {
          position: new Vector(Math.floor(Math.random() * this.width), -this.threeshold),
          direction: new Vector(random(-1, 1), 1)
        };
      case 1:
        return {
          position: new Vector(Math.floor(Math.random() * this.width), this.height + this.threeshold),
          direction: new Vector(random(-1, 1), -1)
        };
      case 2:
        return {
          position: new Vector(-this.threeshold, Math.floor(Math.random() * this.height)),
          direction: new Vector(1, random(-1, 1))
        };
      case 3:
        return {
          position: new Vector(this.width + this.threeshold, Math.floor(Math.random() * this.height)),
          direction: new Vector(-1, random(-1, 1))
        };
    }
  };

  Sky.prototype.createStar = function(position) {
    var start;
    start = this.randomStart();
    this.objects.push(new Star(this, {
      position: position != null ? position : start.position,
      direction: start.direction
    }));
    return this.udpateIndex();
  };

  Sky.prototype.startStack = function() {
    var i, k, ref, results;
    results = [];
    for (i = k = 0, ref = this.startAmount; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      results.push(this.createStar(new Vector(Math.random() * this.width, Math.random() * this.height)));
    }
    return results;
  };

  Sky.prototype.createLine = function(p1, p2) {
    return this.objects.push(new Line(this, p1, p2));
  };

  Sky.prototype.udpateIndex = function() {
    this.index += 1;
    if (this.index >= 3000) {
      return this.index = 0;
    }
  };

  Sky.prototype.start = function() {
    this.index = 0;
    this.startSpawn();
    this.startStack();
    return this.update();
  };

  return Sky;

})(World);

Star = (function(superClass) {
  extend(Star, superClass);

  function Star() {
    Star.__super__.constructor.apply(this, arguments);
    this.opacity = .65;
    this.speed = 1.5;
    this.size = 1.5;
    this.index = this.context.index;
    this.relations = [];
    this.length = 0;
  }

  Star.prototype.update = function(i) {
    Star.__super__.update.apply(this, arguments);
    return this.check(i);
  };

  Star.prototype.check = function(i) {
    var j, k, ref, results;
    results = [];
    for (j = k = 0, ref = i; 0 <= ref ? k < ref : k > ref; j = 0 <= ref ? ++k : --k) {
      if (this.context.objects[j] instanceof Circle && !this.relations[this.context.objects[j].index]) {
        if (this.length < this.context.maxLines && this.context.objects[j].length < this.context.maxLines) {
          if (this.context.lineSize > Vector.distance(this.context.objects[j].position, this.position)) {
            this.relations[this.context.objects[j].index] = true;
            this.context.objects[j].relations[this.index] = true;
            this.length += 1;
            this.context.objects[j].length += 1;
            results.push(this.context.createLine(this, this.context.objects[j]));
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  return Star;

})(Circle);

Line = (function() {
  function Line(context, star1, star2) {
    this.context = context;
    this.star1 = star1;
    this.star2 = star2;
    this.setDistance();
    this.position = new Vector;
    this.lineSize = this.context.lineSize;
    this.stroke = "white";
    this.opacity = 0;
    this.start = new Date();
  }

  Line.prototype.draw = function() {
    this.context.ctx.beginPath();
    this.context.ctx.strokeStyle = this.stroke;
    this.context.ctx.globalAlpha = this.opacity;
    this.context.ctx.moveTo(this.star1.position.x, this.star1.position.y);
    this.context.ctx.lineTo(this.star2.position.x, this.star2.position.y);
    this.context.ctx.stroke();
    return this.context.ctx.closePath();
  };

  Line.prototype.update = function(i) {
    this.draw();
    this.setDistance();
    if (this.start) {
      if (this.opacity < (this.lineSize - this.distance) / 500) {
        this.opacity = Math.min((new Date() - this.start) / 5000, (this.lineSize - this.distance) / 500);
      } else {
        this.start = null;
      }
    } else {
      this.opacity = (this.lineSize - this.distance) / 500;
    }
    if (this.distance > this.lineSize || this.star1.removed && this.star2.removed) {
      return this.remove(i);
    }
  };

  Line.prototype.setDistance = function() {
    return this.distance = Vector.distance(this.star1.position, this.star2.position);
  };

  Line.prototype.remove = function(i) {
    this.context.removeObject(i);
    this.star1.relations[this.star2.index] = null;
    this.star2.relations[this.star1.index] = null;
    this.star1.length -= 1;
    return this.star2.length -= 1;
  };

  return Line;

})();

module.exports = Sky;


},{"../circle":1,"../vector":5,"../world":6}],3:[function(require,module,exports){
var Back, Front;

Front = require("./connect/sky");

Back = require("./running/sky");

new Front(document.querySelector("#front"));

new Back(document.querySelector("#back"));


},{"./connect/sky":2,"./running/sky":4}],4:[function(require,module,exports){
var Circle, Sky, Vector, World,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

World = require("../world");

Vector = require("../vector");

Circle = require("../circle");

Sky = (function(superClass) {
  extend(Sky, superClass);

  function Sky(canvas) {
    this.canvas = canvas;
    Sky.__super__.constructor.apply(this, arguments);
    this.direction = new Vector(1, -this.height / this.width);
    this.quater = 3;
    this.depth = {
      max: .4,
      min: .1
    };
    this.spawnDelay = 100;
    this.startAmount = 600;
    this.bindEvents();
    this.start();
  }

  Sky.prototype.startSpawn = function() {
    return this.spawner = setInterval(this.createStar.bind(this), this.spawnDelay);
  };

  Sky.prototype.stopSpawn = function() {
    return clearInterval(this.spawner);
  };

  Sky.prototype.startStack = function() {
    var i, j, ref, results;
    results = [];
    for (i = j = 0, ref = this.startAmount; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      results.push(this.createStar(new Vector(Math.random() * this.width, Math.random() * this.height)));
    }
    return results;
  };

  Sky.prototype.createStar = function(position) {
    var depth, half;
    half = Math.random() > .5;
    depth = (Math.random() * (this.depth.max - this.depth.min) + this.depth.min).toFixed(4);
    if (!position) {
      switch (this.quater) {
        case 1:
          if (half) {
            position = new Vector(Math.floor(Math.random() * this.width), -this.threeshold);
          } else {
            position = new Vector(this.width + this.threeshold, Math.floor(Math.random() * this.height));
          }
          break;
        case 2:
          if (half) {
            position = new Vector(Math.floor(Math.random() * this.width), -this.threeshold);
          } else {
            position = new Vector(-this.threeshold, Math.floor(Math.random() * this.height));
          }
          break;
        case 3:
          if (half) {
            position = new Vector(-this.threeshold, Math.floor(Math.random() * this.height));
          } else {
            position = new Vector(Math.floor(Math.random() * this.width), this.height + this.threeshold);
          }
          break;
        case 4:
          if (half) {
            position = new Vector(this.width + this.threeshold, Math.floor(Math.random() * this.height));
          } else {
            position = new Vector(Math.floor(Math.random() * this.width), this.height + this.threeshold);
          }
      }
    }
    return this.objects.push(new Circle(this, {
      position: position,
      direction: this.direction,
      size: .5 + depth * 1.5,
      opacity: depth,
      speed: 1.25
    }));
  };

  Sky.prototype.checkPosition = function(i) {
    var o;
    o = this.objects[i];
    switch (this.quater) {
      case 1:
        return o.position.x < -this.threeshold || o.position.y > this.height + this.threeshold;
      case 2:
        return o.position.x > this.width + this.threeshold || o.position.y > this.height + this.threeshold;
      case 3:
        return o.position.x > this.width + this.threeshold || o.position.y < -this.threeshold;
      case 4:
        return o.position.x < -this.threeshold || o.position.y < -this.threeshold;
    }
  };

  Sky.prototype.bindEvents = function() {
    return window.addEventListener("resize", (function(_this) {
      return function() {
        return _this.setSize();
      };
    })(this));
  };

  Sky.prototype.cursor = function(position) {
    this.direction = this.center.copy().substract(position).direction();
    if (this.direction.x >= 0) {
      if (this.direction.y >= 0) {
        return this.quater = 2;
      } else {
        return this.quater = 3;
      }
    } else {
      if (this.direction.y >= 0) {
        return this.quater = 1;
      } else {
        return this.quater = 4;
      }
    }
  };

  Sky.prototype.start = function() {
    this.startSpawn();
    this.startStack();
    return this.update();
  };

  return Sky;

})(World);

module.exports = Sky;


},{"../circle":1,"../vector":5,"../world":6}],5:[function(require,module,exports){
var Vector;

Vector = (function() {
  function Vector(x, y) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
  }

  Vector.prototype.add = function(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  };

  Vector.prototype.substract = function(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  };

  Vector.prototype.scalar = function(n) {
    return new Vector(this.x * n, this.y * n);
  };

  Vector.prototype.direction = function() {
    var max;
    max = Math.max(Math.abs(this.x), Math.abs(this.y));
    return new Vector(this.x / max, this.y / max);
  };

  Vector.prototype.copy = function() {
    return new Vector(this.x, this.y);
  };

  Vector.distance = function(v1, v2) {
    return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
  };

  return Vector;

})();

module.exports = Vector;


},{}],6:[function(require,module,exports){
var Vector, World;

Vector = require("./vector");

World = (function() {
  function World(canvas) {
    this.canvas = canvas;
    this.setSize();
    this.bindEvents();
    this.ctx = this.canvas.getContext("2d");
    this.threeshold = 50;
    this.objects = [];
  }

  World.prototype.setSize = function() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.max = Math.max(this.width, this.height);
    return this.center = new Vector(this.width / 2, this.height / 2);
  };

  World.prototype.removeObject = function(i) {
    this.objects[i].removed = true;
    return this.objects.splice(i, 1);
  };

  World.prototype.update = function() {
    var i, j, ref, results;
    requestAnimationFrame(this.update.bind(this));
    this.clear();
    results = [];
    for (i = j = ref = this.objects.length - 1; ref <= 0 ? j <= 0 : j >= 0; i = ref <= 0 ? ++j : --j) {
      if (this.objects[i]) {
        this.objects[i].update(i);
        if (this.checkPosition(i)) {
          results.push(this.removeObject(i));
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  World.prototype.checkPosition = function(i) {
    if (this.objects[i]) {
      return this.objects[i].position.x > this.width + this.threeshold || this.objects[i].position.x < -this.threeshold || this.objects[i].position.y < -this.threeshold || this.objects[i].position.y > this.height + this.threeshold;
    } else {
      return false;
    }
  };

  World.prototype.clear = function() {
    return this.ctx.clearRect(0, 0, this.width, this.height);
  };

  World.prototype.bindEvents = function() {
    return window.addEventListener("resize", (function(_this) {
      return function() {
        return _this.setSize();
      };
    })(this));
  };

  return World;

})();

module.exports = World;


},{"./vector":5}]},{},[3]);
