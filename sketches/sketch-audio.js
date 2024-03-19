const canvasSketch = require('canvas-sketch');
const {math} = require("canvas-sketch-util");

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

let manager;

let audio;
let audioContext, audioData, sourceNode, analyserNode;
const sketch = () => {
  const bins = [4, 12, 37];

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    if (!analyserNode) {
        return;
    }

    analyserNode.getFloatFrequencyData(audioData);

    bins.forEach(bin => {
        const mapped = math.mapRange(audioData[bin], analyserNode.minDecibels, analyserNode.maxDecibels, 0, 1, true);
        const radius = mapped * 300;

        context.save();
        context.translate(width/2, height/2);
        context.lineWidth = 10;

        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.stroke();
        context.restore();
    })
  };
};

const createAudio = () => {
    audio = document.createElement('audio');
    audio.src = '../assets/audio/FmajChords2.mp3';

    audioContext = new AudioContext();

    sourceNode = audioContext.createMediaElementSource(audio);
    sourceNode.connect(audioContext.destination);

    analyserNode = audioContext.createAnalyser();
    analyserNode.smoothingTimeConstant = 0.95;
    sourceNode.connect(analyserNode);

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
