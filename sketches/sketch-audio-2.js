const canvasSketch = require('canvas-sketch');
const eases = require('eases');
const random = require('canvas-sketch-util/random');
const {mapRange} = require("canvas-sketch-util/math");

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

let manager;

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let minDb, maxDb;

const sketch = () => {
  const bins = [];
  const rotationOffsets = [];

  // Arcs params
  const numCircles = 7;
  const numSlices = 1;
  const slice = Math.PI * 2 / numSlices;
  const radius = 200;
  const lineWidths = [];
  let phi;

  let lineWidth = 4;

  // Calculate bins
  for (let i = 0; i < numCircles * numSlices; i ++) {
      let bin = random.rangeFloor(4, 64);

      bins.push(bin);
  }

  // Calculate lines width
  for (let i = 0; i < numCircles; i ++) {
      const t = i / (numCircles - 1); // Param for ease function

      lineWidth = eases.quadIn(t) * 200 + 20;
      lineWidths.push(lineWidth);
  }

  // Calculate rotation offsets of slices
  for (let i = 0; i < numCircles; i ++) {
      rotationOffsets.push(random.range(-Math.PI / 4, Math.PI / 4) - Math.PI / 2);
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    if (!analyserNode) {
        return;
    }

    analyserNode.getFloatFrequencyData(audioData);

    context.save();
    context.translate(width/2, height/2);

    let cradius = radius; // Cumulative radius

    for (let i = 0; i < numCircles; i ++) {
        context.save();
        context.rotate(rotationOffsets[i]);

        cradius += lineWidths[i] * 0.5 + 2

        for (let j = 0; j < numSlices; j ++) {
            context.rotate(slice);
            context.lineWidth = lineWidths[i];

            const bin = bins[i * numSlices + j];

            const mapped = mapRange(audioData[bin], minDb, maxDb, 0, 1, true);
            phi = slice * mapped;

            context.beginPath();
            context.arc(0, 0, cradius, rotationOffsets[i] * mapped, phi);
            context.stroke();
        }

        cradius += lineWidths[i] * 0.5;

        context.restore();
    }

    context.restore();
  };
};

const createAudio = () => {
    audio = document.createElement('audio');
    audio.src = '../assets/audio/FmajChords2.mp3';

    audioContext = new AudioContext();

    sourceNode = audioContext.createMediaElementSource(audio);
    sourceNode.connect(audioContext.destination);

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 512;
    analyserNode.smoothingTimeConstant = 0.95;
    sourceNode.connect(analyserNode);

    minDb = analyserNode.minDecibels;
    maxDb = analyserNode.maxDecibels;

    audioData = new Float32Array(analyserNode.frequencyBinCount);
}

const start = async () => {
    window.addEventListener('mouseup', () => {
        if (!audioContext) {
            createAudio();
        }

        if (audio.paused) {
            audio.play();
            manager.play();
        } else {
            audio.pause();
            manager.pause();
        }
    });

    manager = await canvasSketch(sketch, settings);

    manager.pause();
}

start();
