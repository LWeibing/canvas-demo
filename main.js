document.body.ontouchmove = function (e) {
  e.preventDefault();
};
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let painting = false;
let isTouchDevice = "ontouchstart" in document.documentElement;
let points = [];
let lastImg;
let beginPoint;
let clear = document.querySelector(".clear");
let eraser = document.querySelector(".eraser");
let download = document.querySelector(".download");
let flag = false;
let colorList = document.querySelector(".color").getElementsByTagName("li");
let lineList = document.querySelector(".line-width").getElementsByTagName("li");
let creatCanvas = () => {
  canvas.setAttribute("width", canvas.offsetWidth);
  canvas.setAttribute("height", canvas.offsetHeight);
  ctx.fillStyle = "red";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
};
creatCanvas();

if (isTouchDevice) {
  canvas.ontouchstart = (e) => {
    const { x, y } = getPhonePos(e);
    points.push({ x, y });
    beginPoint = { x, y };
    lastImg = ctx.getImageData(0, 50, canvas.width, canvas.height);
  };
  canvas.ontouchmove = (e) => {
    const { x, y } = getPhonePos(e);
    points.push({ x, y });
    getCurve(points);
  };
} else {
  canvas.onmousedown = (e) => {
    lastImg = ctx.getImageData(0, 50, canvas.width, canvas.height);
    painting = true;
    const { x, y } = getPos(e);
    points.push({ x, y });
    beginPoint = { x, y };
    canvas.onmousemove = (e) => {
      if (painting === true) {
        const { x, y } = getPos(e);
        points.push({ x, y });
        getCurve(points);
      }
    };
  };
  canvas.onmouseup = () => {
    painting = false;
  };
}
for (let i = 0; i < colorList.length; i++) {
  colorList[i].style.backgroundColor = colorList[i].getAttribute("name");
  colorList[i].onclick = function () {
    for (let j = 0; j < colorList.length; j++) {
      colorList[j].className = "tool";
    }
    this.className = "tool selected";
    ctx.strokeStyle = colorList[i].getAttribute("name");
  };
}
for (let i = 0; i < lineList.length; i++) {
  lineList[i].style.borderWidth = lineList[i].getAttribute("index") + "px";
  lineList[i].onclick = function () {
    for (let j = 0; j < lineList.length; j++) {
      lineList[j].className = "tool";
    }
    this.className = "tool selected";
    ctx.lineWidth = lineList[i].getAttribute("index");
  };
}
clear.addEventListener("click", () => {
  creatCanvas();
});

eraser.addEventListener("click", () => {
  ctx.putImageData(lastImg, 0, 50);
});
download.addEventListener("click", () => {
  downLoadImage(canvas, 1);
});

function drawLine(beginPoint, controlPoint, endPoint) {
  ctx.beginPath();
  ctx.moveTo(beginPoint.x, beginPoint.y);
  ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
  ctx.stroke();
}
function getCurve(arr) {
  if (arr.length > 3) {
    const lastTowPoints = arr.slice(-2);
    const controlPoint = lastTowPoints[0];
    const endPoint = {
      x: (lastTowPoints[0].x + lastTowPoints[1].x) / 2,
      y: (lastTowPoints[0].y + lastTowPoints[1].y) / 2,
    };
    drawLine(beginPoint, controlPoint, endPoint);
    beginPoint = endPoint;
  }
}
function getPos(e) {
  return {
    x: e.clientX,
    y: e.clientY - 50,
  };
}
function getPhonePos(e) {
  return {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY - 50,
  };
}
function downLoadImage(canvas, name) {
  var a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = name;
  a.click();
}
