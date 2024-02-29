const canvasSketch = require('canvas-sketch');
const {random} = require("canvas-sketch-util");

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

  // Noise
  const frequency = 0.001;
  const amplitude = 90;

  for (let i = 0; i < numCells; i ++) {
    let x = i % cols * cw;
    let y = Math.floor(i / cols) * ch;
    const n = random.noise2D(x, y, frequency, amplitude);

    x += n;
    y += n;

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

    // Drawing lines
    for (let r = 0; r < rows; r ++) {
      context.beginPath();

      for (let c = 0; c < cols - 1; c ++) {
        const currentPoint = points[r * cols + c + 0];
        const nextPoint = points[r * cols + c + 1];

        const mx = currentPoint.x + (nextPoint.x - currentPoint.x) / 2;
        const my = currentPoint.y + (nextPoint.y - currentPoint.y) / 2;

        if (c === 0) {
          context.moveTo(currentPoint.x, currentPoint.y);
        } else if (c === cols - 2) {
          context.quadraticCurveTo(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y);
        } else  {
          context.quadraticCurveTo(currentPoint.x, currentPoint.y, mx, my);
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
