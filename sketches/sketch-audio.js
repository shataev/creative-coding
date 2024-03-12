const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

let manager;

let audio;
let audioContext, audioData, sourceNode, analyserNode;
const sketch = () => {

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    if (!analyserNode) {
        return;
    }

    analyserNode.getFloatFrequencyData(audioData);

    const avg = getAverage(audioData);

    context.save();
    context.translate(width/2, height/2);
    context.lineWidth = 10;

    context.beginPath();
    context.arc(0, 0,Math.abs(avg), 0, Math.PI * 2);
    context.stroke();
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
    sourceNode.connect(analyserNode);

    audioData = new Float32Array(analyserNode.frequencyBinCount);
}

const getAverage = (data) => {
    const sum = data.reduce((acc, current) => acc + current);

    return sum / data.length;
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
