const canvasSketch = require('canvas-sketch');
const {random, math} = require("canvas-sketch-util");
const colormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const sketch = ({context, width, height}) => {
  const cols = 92;
  const rows = 2;
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


  // Props of segments
  let x, y, lineWidth, color;

  // Noise
  const frequency = 0.001;
  const amplitude = 190;
  let n;

  let colors = colormap({
    colormap: 'electric',
    nshades: amplitude,
  })

  for (let i = 0; i < numCells; i ++) {
    x = i % cols * cw;
    y = Math.floor(i / cols) * ch;

    n = random.noise2D(x, y, frequency, amplitude);

    lineWidth = math.mapRange(n, -amplitude, amplitude, 0, 5);
    color = colors[Math.floor(math.mapRange(n, -amplitude, amplitude, 0, amplitude))];


    points.push(new Point({x, y, lineWidth, color}));
  }

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.save();

    context.translate(mx, my);
    context.translate(cw/2, ch/2);
    context.strokeStyle = 'red';
    context.lineWidth = 4;

    points.forEach(point => {
      n = random.noise2D(point.ix + frame * 4, point.iy + frame * 4, frequency, amplitude);
      point.x = point.ix + n;
      point.y = point.iy + n;
    })

    // Drawing lines by segments
    let lastx, lasty;

    for (let r = 0; r < rows; r ++) {

      for (let c = 0; c < cols - 1; c ++) {
        const currentPoint = points[r * cols + c + 0];
        const nextPoint = points[r * cols + c + 1];

        const mx = currentPoint.x + (nextPoint.x - currentPoint.x) * 0.8;
        const my = currentPoint.y + (nextPoint.y - currentPoint.y) * 5.5;


        if (c === 0) {
          lastx = currentPoint.x;
          lasty = currentPoint.y;
        }

        context.beginPath();
        context.lineWidth = currentPoint.lineWidth;
        context.strokeStyle = currentPoint.color;

        context.moveTo(lastx, lasty);
        context.quadraticCurveTo(currentPoint.x, currentPoint.y, mx, my);
        context.stroke();

        lastx = mx - c/cols * 250;
        lasty = my - r/rows * 250;
      }

    }

    context.restore();
  };
};

class Point {
  constructor({x, y, lineWidth, color}){
    this.x = x;
    this.y = y;
    this.lineWidth = lineWidth;
    this.color = color;

    this.ix = x;
    this.iy = y;
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
