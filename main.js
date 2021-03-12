document.querySelector("body").addEventListener("touchmove", function (e) {
  e.preventDefault();
});
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let painting = false;
let isTouchDevice = "ontouchstart" in document.documentElement;
let points = [];
let beginPoint;
let clear = document.querySelector(".clear");
let eraser = document.querySelector(".eraser");
let flag = false;
let creatCanvas = () => {
  canvas.setAttribute("width", canvas.offsetWidth);
  canvas.setAttribute("height", canvas.offsetHeight);
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
};
creatCanvas();

if (isTouchDevice) {
  canvas.ontouchstart = (e) => {
    const { x, y } = getPos(e);
    points.push({ x, y });
    beginPoint = { x, y };
  };
  canvas.ontouchmove = (e) => {
    const { x, y } = getPos(e);
    points.push({ x, y });

    if (points.length > 3) {
      const lastTowPoints = points.slice(-2);
      const controlPoint = lastTowPoints[0];
      const endPoint = {
        x: (lastTowPoints[0].x + lastTowPoints[1].x) / 2,
        y: (lastTowPoints[0].y + lastTowPoints[1].y) / 2,
      };
      drawLine(beginPoint, controlPoint, endPoint);
      beginPoint = endPoint;
    }
  };
} else {
  canvas.onmousedown = (e) => {
    painting = true;
    const { x, y } = getPos(e);
    points.push({ x, y });
    beginPoint = { x, y };
    canvas.onmousemove = (e) => {
      if (painting === true) {
        const { x, y } = getPos(e);
        points.push({ x, y });

        if (points.length > 3) {
          const lastTowPoints = points.slice(-2);
          const controlPoint = lastTowPoints[0];
          const endPoint = {
            x: (lastTowPoints[0].x + lastTowPoints[1].x) / 2,
            y: (lastTowPoints[0].y + lastTowPoints[1].y) / 2,
          };
          drawLine(beginPoint, controlPoint, endPoint);
          beginPoint = endPoint;
        }
      }
    };
  };
  canvas.onmouseup = () => {
    painting = false;
  };
}

function drawLine(beginPoint, controlPoint, endPoint) {
  ctx.beginPath();
  ctx.moveTo(beginPoint.x, beginPoint.y);
  ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
  ctx.stroke();
}
function getPos(e) {
  return {
    x: e.clientX,
    y: e.clientY - 50,
  };
}
clear.addEventListener("click", () => {
  creatCanvas();
});

eraser.addEventListener("click", (e) => {
  flag = !flag;
});
