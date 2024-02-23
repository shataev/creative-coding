const canvasSketch = require('canvas-sketch');
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const colorUtil = require("canvas-sketch-util/color");
const risoColors = require('riso-colors');

const settings = {
  dimensions: [ 1080, 1080 ],
};

/**
 * Draw rectangle
 */
const sketch = ({ width, height }) => {
  let w, h, cx, cy, fill, stroke, blend;
  const num = 37;
  const deg = 24;

  const rects = [];

  const rectColors = [
    random.pick(risoColors).hex,
    random.pick(risoColors).hex,
  ]

  const bgColor = random.pick(risoColors).hex;

  for (let i = 0; i < num; i ++) {
    // Coordinates of the center of canvas
    cx = random.range(0, width);
    cy = random.range(0, height);

    // Dimensions of rectangle
    w = random.range(400, width);
    h = random.range(40, 200);

    fill = random.pick(rectColors);
    stroke = random.pick(rectColors);

    blend = random.value() > 0.5 ? 'overlay' : 'source-over';

    rects.push({
      w,
      h,
      cx,
      cy,
      fill,
      stroke,
      blend,
    })

  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    rects.forEach(rect => {
      const {w, h, cx, cy, fill, stroke, blend} = rect;
      let shadowColorHSL = colorUtil.offsetHSL(fill, 0, 0, -20);
      shadowColorHSL.rgba[3] = 0.5;
      let shadowColorRGBA = colorUtil.style(shadowColorHSL.rgba);

      context.save();

      // Translate the context for placing the rectangle in the center
      context.translate(cx, cy)

      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = 10;
      context.globalCompositeOperation = blend;

      drawSkewedRect({context, w, h, deg})

      context.shadowColor = shadowColorRGBA;
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;

      context.fill();
      context.shadowColor = null;
      context.stroke();


      context.globalCompositeOperation = 'source-over';

      context.lineWidth = 2;
      context.strokeStyle = 'black';
      context.stroke();

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

  context.restore();
}

canvasSketch(sketch, settings);
