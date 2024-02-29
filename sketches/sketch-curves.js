const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = ({context, width, height}) => {
  const cols = 12;
  const rows = 6;
  const numCells = cols * rows;

  // Grid
  const gw = 0.8 * width;
  const gh = 0.8 * height;

  // Cells
  const cw = gw / cols;
  const ch = gh / rows;

  // Margins
  const mx = (width - gw) / 2;
  const my = (height - gh) / 2;

  const points = [];


  for (let i = 0; i < numCells; i ++) {
    const x = i % cols * cw;
    const y = Math.floor(i / cols) * ch;

    points.push(new Point({x, y}));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.save();

    context.translate(mx, my);
    context.translate(cw/2, ch/2);
    context.strokeStyle = 'red';
    context.lineWidth = 4;

    points.forEach(point => {
      point.draw(context);
    })

    for (let r = 0; r < rows; r ++) {
      context.beginPath();

      for (let c = 0; c < cols; c ++) {
        const point = points[r * cols + c];

        if (c === 0) {
          context.moveTo(point.x, point.y);
        } else {
          context.lineTo(point.x, point.y);
        }
      }

      context.stroke()
    }

    context.restore();
  };
};

class Point {
  constructor({x, y}){
    this.x = x;
    this.y = y;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = 'red';

    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}

canvasSketch(sketch, settings);
