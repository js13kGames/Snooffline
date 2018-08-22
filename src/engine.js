function Engine(config) {
  this.config = {
    canvasId: config || "display",
    fps: config || 60
  };

  this.time = {
    now: 0,
    then: performance.now(),
    interval: 1000 / 60,
    delta: 0
  };
}

Engine.prototype.init = function() {
  this.canvas = document.getElementById(this.config.canvasId);
  this.canvas.width = 800; // window.innerWidth;
  this.canvas.height = 600; // window.innerHeight;
  this.ctx = this.canvas.getContext("2d");
  this.gfx = new Graphics();
  this.game = new Game();

  let cached = this.gfx.addToCache("cocaine", "src/cocaine.png");

  cached.then(() => {
    this.loop();
  });
};

Engine.prototype.loop = function() {
  requestAnimationFrame(this.loop.bind(this));

  var t = this.time;

  t.now = performance.now();
  t.delta = t.now - t.then;

  if (t.delta > t.interval) {
    t.then = t.now - (t.delta % t.interval);

    this.update(t.delta);
    this.render();
  }
};

Engine.prototype.render = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.gfx.render(this.canvas, this.ctx);
};

Engine.prototype.update = function(delta) {
  this.game.update(delta);
};
