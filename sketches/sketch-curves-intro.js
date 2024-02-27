const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

// We need this element for calculate cursor coordinates
let elCanvas;
let points;

const sketch = ({canvas}) => {
  points = [
    new Point(200, 540),
    new Point(340, 40),
    new Point(880, 540),
    new Point(600, 700),
    new Point(640, 900),
  ]

  elCanvas = canvas;
  canvas.addEventListener('mousedown', onMouseDown)

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // Draw connecting lines for finding middle points START
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    context.strokeStyle = '#ccc';

    for (let i = 0; i < points.length; i ++) {
      context.lineTo(points[i].x, points[i].y);
    }

    context.stroke();
    context.closePath();
    // Draw connecting lines for finding middle points END

    // Middle points START
    for (let i = 0; i < points.length - 1; i ++) {
      const currentPoint = points[i];
      const nextPoint = points[i + 1];

      const mx = currentPoint.x + (nextPoint.x - currentPoint.x) / 2;
      const my = currentPoint.y + (nextPoint.y - currentPoint.y) / 2;

      context.beginPath();
      context.arc(mx, my, 5, 0, Math.PI * 2);
      context.fillStyle = 'blue';
      context.fill();
    }
    // Middle points END

    // Curves by middle points START
    context.beginPath();
    //context.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i ++) {
      const currentPoint = points[i];
      const nextPoint = points[i + 1];

      const mx = currentPoint.x + (nextPoint.x - currentPoint.x) / 2;
      const my = currentPoint.y + (nextPoint.y - currentPoint.y) / 2;

      if (i === 0) {
        context.moveTo(currentPoint.x, currentPoint.y);
      } else if (i === points.length - 2) {
        context.quadraticCurveTo(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y);
      } else  {
        context.quadraticCurveTo(currentPoint.x, currentPoint.y, mx, my);
      }
    }

    context.lineWidth = 4;
    context.strokeStyle = 'maroon';
    context.stroke();
    context.closePath();
    // Curves by middle points END

    points.forEach(point=>point.draw(context))
  };
};


const onMouseDown = (e) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight ) * elCanvas.height;
  let hit = false;

  points.map(point => {
    point.isDragging = point.hitTest(x, y);

    if (point.isDragging) {
      hit = true;
    }
  })

  if (!hit) {
    points.push(new Point(x, y));
  }
}

const onMouseMove = (e) => {
  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight ) * elCanvas.height;

  points.forEach(point => {
    if (point.isDragging) {
      point.x = x;
      point.y = y;
    }
  })
}

const onMouseUp = () => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
}


class Point {
  constructor(x, y, control = false){
    this.x = x;
    this.y = y;
    this.control = control;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.control ? 'red' : 'black';

    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  hitTest(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;

    const dd = Math.sqrt(dx * dx + dy * dy);

    return dd < 20;
  }
}

canvasSketch(sketch, settings);
