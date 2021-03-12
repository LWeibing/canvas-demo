document.querySelector( 'body' ).addEventListener( 'touchmove' ,  function (e) {
  e.preventDefault();
})
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let painting = false;
let isTouchDevice = "ontouchstart" in document.documentElement;
let last;
let clear = document.querySelector(".clear");
let eraser = document.querySelector(".eraser");
let flag =false;
let creatCanvas = () => {
  canvas.setAttribute('width',canvas.offsetWidth)
  canvas.setAttribute('height',canvas.offsetHeight)
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.lineCap = "round";
  ctx.lineJoin="round";
};
creatCanvas();

if (isTouchDevice) {
  canvas.ontouchstart = (e) => {
    let phoneX = e.touches[0].clientX;
    let phoneY = e.touches[0].clientY-50;
    last = [phoneX, phoneY];
  };
  canvas.ontouchmove = (e) => {
    let phoneX = e.touches[0].clientX;
    let phoneY = e.touches[0].clientY-50;
    drawLine(last[0], last[1], phoneX, phoneY);
    last = [phoneX, phoneY];
  };
} else {
  canvas.onmousedown = (e) => {
    console.log(e.clientY)
    painting = true;
    last = [e.clientX, e.clientY-50];
    canvas.onmousemove = (e) => {
      if (painting === true) {
        drawLine(last[0], last[1], e.clientX, e.clientY-50);
        last = [e.clientX, e.clientY-50];
      }
    };
  };
  canvas.onmouseup = () => {
    painting = false;
  };
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

clear.addEventListener("click", () => {
  creatCanvas();
});

eraser.addEventListener("click", (e) => {
    flag=!flag
});
