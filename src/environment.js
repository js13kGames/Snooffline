function Environment() {
  this.switch = 0;
  this.numBuildings = 25;
  this.heights = [];
  for (let i = 0; i < this.numBuildings; ++i) {
    this.heights.push(20 + Math.random() * 100);
  }
  this.lineColor = "#9B30FF";
  this.buildingColor = "#4744FF";
}

Environment.prototype.addToCache = async function(id, graphicSrc) {
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

Environment.prototype.render = function(game) {
  game.ctx.shadowBlur = 10;
  game.ctx.shadowColor = "white";

  this.drawBackground(game);
  this.drawCity(game);
  this.drawRoad(game);
};

Environment.prototype.drawBackground = function(game) {
  const env = game.geometry.environment;

  game.ctx.fillStyle = "black";
  game.ctx.fillRect(0, 0, env.width, env.height);
  game.ctx.fillStyle = this.lineColor;
  game.ctx.font = "30px Arial";
  game.ctx.fillText(`Snooffline`, 10, 30);
  game.ctx.font = "20px Arial";
  game.ctx.fillText(`Score: ${game.player.score}`, 10, 60);
};

Environment.prototype.drawCity = function(game) {
  game.ctx.strokeStyle = this.buildingColor;
  for (let i = 0; i < this.numBuildings; ++i) {
    this.drawBuilding(game, i * (30 + 5), this.heights[i], 30);
  }
};

Environment.prototype.drawBuilding = function(game, x, height, width) {
  const env = game.geometry.environment;
  var poly = [
    x,
    env.horizontAtY,
    x,
    env.horizontAtY - height,
    x + width,
    env.horizontAtY - height,
    x + width,
    env.horizontAtY
  ];

  game.ctx.beginPath();
  game.ctx.moveTo(poly[0], poly[1]);
  for (item = 2; item < poly.length - 1; item += 2) {
    game.ctx.lineTo(poly[item], poly[item + 1]);
  }
  game.ctx.stroke();
};

Environment.prototype.drawRoad = function(game) {
  const env = game.geometry.environment;
  game.ctx.strokeStyle = this.lineColor;
  game.ctx.beginPath();
  //Horizon point is at [400, 250]
  //Left lane
  game.ctx.moveTo(0, game.canvas.height);
  game.ctx.lineTo(env.horizontLeft.x, env.horizontLeft.y);
  //Mid lanes
  for (let i = 0; i < 63; ++i) {
    const offset = i * (env.width / 63);

    let lineEnd = pointAtY(
      env.focalPoint,
      { x: offset, y: env.horizontAtY },
      game.canvas.height
    ).x;

    lineEnd =
      lineEnd < 0
        ? 0
        : lineEnd > game.canvas.width
          ? game.canvas.width
          : lineEnd;

    game.ctx.moveTo(offset, env.horizontAtY);
    game.ctx.lineTo(
      lineEnd,
      pointAtX(env.focalPoint, { x: offset, y: env.horizontAtY }, lineEnd).y
    );
  }
  //Right lane
  game.ctx.moveTo(game.canvas.width, game.canvas.height);
  game.ctx.lineTo(env.horizontRight.x, env.horizontRight.y);

  //Road lines
  const numLines = 20;
  const tick = game.time.now % numLines;
  for (let i = 0; i < numLines; ++i) {
    const Y = env.horizontAtY + i * 20 + tick;
    const start = pointAtY(env.focalPoint, env.bottomLeft, Y);
    const end = pointAtY(env.focalPoint, env.bottomRight, Y);
    game.ctx.moveTo(start.x, start.y);
    game.ctx.lineTo(end.x, end.y);
  }

  //Horizon
  game.ctx.moveTo(0, env.horizontAtY);
  game.ctx.lineTo(game.canvas.width, env.horizontAtY);

  game.ctx.stroke();
};
