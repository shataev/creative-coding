const canvasSketch = require('canvas-sketch');
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [ 1080, 1080 ],
};

/**
 * Draw rectangle
 */
const sketch = ({ context, width, height }) => {
  let x, y, w, h, cx, cy;
  let angle, rx, ry;
  const num = 60;
  const deg = 24;

  let rects = [];

  for (let i = 0; i < num; i ++) {
    // Coordinates of the center of canvas
    cx = random.range(0, width);
    cy = random.range(0, height);

    // Dimensions of rectangle
    w = random.range(200, 600);
    h = random.range(40, 200);

    rects.push({
      w,
      h,
      cx,
      cy
    })

  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    rects.forEach(rect => {

      const {w, h, cx, cy} = rect;

      context.save();

      // Translate the context for placing the rectangle in the center
      context.translate(cx, cy)

      context.strokeStyle = 'blue';

      drawSkewedRect({context, w, h, deg})

      context.restore();

    })
  };
};

const drawSkewedRect = ({context, w = 600, h = 400, deg = 45}) => {
  const angle = math.degToRad(deg);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  context.save();

  // Translate the context for placing the rectangle in the center
  context.translate(-rx/2, -ry/2 - h/2)

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry );
  context.lineTo(rx, ry + h );
  context.lineTo(0, h );
  context.lineTo(0, 0 );
  context.closePath();
  context.stroke();

  context.restore();
}

canvasSketch(sketch, settings);
