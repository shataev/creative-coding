const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

/**
 * Draw rectangle
 */
const sketch = () => {
  let x, y, w, h, cx, cy;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // Coordinates of the center of canvas
    cx = 0.5 * width;
    cy = 0.5 * height;

    // Dimensions of rectangle
    w = 0.6 * width;
    h = 0.1 * height;

    // Left top corner of the rectangle
    x = -0.5 * w;
    y = -0.5 * h

    context.save();

    // Translate the context for placing the rectangle in the center
    context.translate(cx, cy)

    context.strokeStyle = 'blue';
    context.strokeRect(x, y, w, h);

    context.restore();

    // Another method to draw rectangle: step by step
    context.save();

    // Change start point of drawing
    cx = 0.5 * width - 0.5 * w;
    cy = 0.5 * height - 0.5 * h + 2 * h;

    context.translate(cx, cy)

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(w, 0 );
    context.lineTo(w, h );
    context.lineTo(0, h );
    context.lineTo(0, 0 );
    context.stroke();
  };
};

canvasSketch(sketch, settings);
