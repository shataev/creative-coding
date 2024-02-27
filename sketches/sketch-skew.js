const canvasSketch = require('canvas-sketch');
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const colorUtil = require("canvas-sketch-util/color");
const risoColors = require('riso-colors');

const settings = {
  dimensions: [ 1080, 1080 ],
};

const seed = random.getRandomSeed();

/**
 * Draw rectangle
 */
const sketch = ({ width, height }) => {
  random.setSeed(seed);
  console.info('Seed:', seed);

  let w, h, cx, cy, fill, stroke, blend;
  const num = 40;
  const deg = -30;
  const bgColor = random.pick(risoColors).hex;

  const rects = [];

  const rectColors = [
    random.pick(risoColors).hex,
    random.pick(risoColors).hex,
  ]

  const mask = {
    radius: width * 0.4,
    sides: 3,
    x: width / 2,
    y: height / 2,
  }


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

    // Drawing mask(triangle)
    context.save();

    // Move context to center of canvas
    context.translate(mask.x, mask.y);

    drawPolygon({context, radius: mask.radius, sides: mask.sides})

    context.clip();

    // Drawing mask(triangle) end

    rects.forEach(rect => {
      const {w, h, cx, cy, fill, stroke, blend} = rect;
      let shadowColorHSL = colorUtil.offsetHSL(fill, 0, 0, -20);
      shadowColorHSL.rgba[3] = 0.5;
      let shadowColorRGBA = colorUtil.style(shadowColorHSL.rgba);

      context.save();

      // Translate the context for placing the rectangle in the center
      context.translate(-mask.x, -mask.y)
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
    });


    context.restore();


    //Drawing polygon outline
    context.save();
    context.translate(mask.x, mask.y)
    context.lineWidth = 20;

    drawPolygon({context, radius: mask.radius - context.lineWidth, sides: mask.sides})

    context.globalCompositeOperation = 'color-burn'
    context.strokeStyle = rectColors[0];
    context.stroke();

    context.restore();
    //Drawing polygon outline end
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

const drawPolygon = ({context, radius = 100, sides = 3}) => {
  const slice = Math.PI * 2 / sides;

  context.beginPath();
  context.moveTo(0, -radius);

  for (let i = 1; i < sides; i ++) {
    let angle = i * slice - Math.PI / 2;

    context.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }

  context.closePath();
}

canvasSketch(sketch, settings);
