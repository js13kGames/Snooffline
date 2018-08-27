function Game(config) {
  this.config = {
    canvasId: config || "display",
    fps: config || 60,
    gravity: 0.5,
    jumpImpulse: 10,
    groundPoint: 500,
    leftBorder: 150,
    rightBorder: 650
  };

  this.time = {
    now: 0,
    then: performance.now(),
    interval: 1000 / 60,
    delta: 0
  };

  this.cache = {};
}

Game.prototype.addToCache = async function(id, graphicSrc) {
  console.log("Caching...");
  return new Promise((resolve, reject) => {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var graphic = new Image();

    graphic.src = graphicSrc;
    graphic.onload = () => {
      canvas.width = graphic.width;
      canvas.height = graphic.height;
      context.drawImage(graphic, 0, 0);
      this.cache[id] = canvas;
      resolve();
    };
  });
};

Game.prototype.init = function() {
  this.canvas = document.getElementById(this.config.canvasId);
  this.canvas.width = 800; // window.innerWidth;
  this.canvas.height = 600; // window.innerHeight;
  this.ctx = this.canvas.getContext("2d");

  this.environment = new Environment();
  this.controls = new Controls();
  this.player = new Player();

  let cached = this.addToCache("cocaine", "src/cocaine.png");

  cached.then(() => {
    this.controls.init();
    this.loop();
  });
};

Game.prototype.loop = function(time) {
  var t = this.time;

  t.now = time;
  t.delta = t.now - t.then;

  if (t.delta > t.interval) {
    t.then = t.now - (t.delta % t.interval);
    this.update(t.delta);
    this.render();
  }
  requestAnimationFrame(this.loop.bind(this));
};

Game.prototype.render = function() {
  var game = this;
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.environment.render(game);
  this.player.render(game);
};

Game.prototype.update = function(delta) {
  var game = this;
  this.player.update(game);
};
