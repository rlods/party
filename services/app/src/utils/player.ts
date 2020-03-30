export const AUDIO_CONTEXT = new (window.AudioContext ||
  (window as any).webkitAudioContext)();

// ------------------------------------------------------------------

export const loadAudioBuffer = (url: string): Promise<AudioBuffer> =>
  new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "arraybuffer";
    req.addEventListener(
      "error",
      () => reject(new Error("Audio buffer loading failed")),
      false
    );
    req.addEventListener(
      "load",
      async () => {
        try {
          // https://github.com/WebAudio/web-audio-api/issues/1305
          resolve(await AUDIO_CONTEXT.decodeAudioData(req.response));
        } catch (error) {
          // INA sometimes returns raw text 'Fichier non trouve' without any error code
          reject(error);
        }
      },
      false
    );
    req.send();
  });

// ------------------------------------------------------------------

export const Player = () => {
  let prevNode: AudioNode = AUDIO_CONTEXT.destination;

  const gainNode = AUDIO_CONTEXT.createGain();
  gainNode.gain.value = 1.0;
  gainNode.connect(prevNode);
  prevNode = gainNode;

  const analyserNode = AUDIO_CONTEXT.createAnalyser();
  analyserNode.fftSize = 128;
  // analyserNode.minDecibels = -90;
  // analyserNode.maxDecibels = -10;
  analyserNode.connect(prevNode);
  prevNode = analyserNode;

  let buffer: AudioBuffer | null = null;
  let bufferUrl: string = "";

  const load = async (url: string) => {
    if (bufferUrl !== url) {
      console.log("Loading audio...", { url });
      buffer = await loadAudioBuffer(url);
      bufferUrl = url;
    }
  };

  let sourceNode: AudioBufferSourceNode | null = null;

  const play = (offset: number) => {
    stop();
    console.log("Starting audio...");
    sourceNode = AUDIO_CONTEXT.createBufferSource();
    sourceNode.buffer = buffer;
    sourceNode.loop = false;
    sourceNode.loopStart = 0;
    sourceNode.loopEnd = 0;
    sourceNode.onended = () => {
      console.log("Audio terminated...");
    };
    sourceNode.playbackRate.value = 1.0;
    sourceNode.connect(prevNode);
    sourceNode.start(0, offset); // A new BufferSource must be created for each start
  };

  const stop = () => {
    if (null !== sourceNode) {
      console.log("Stopping audio...");
      sourceNode.stop();
      sourceNode = null;
    }
  };

  return {
    analyserNode,
    gainNode,
    load,
    play,
    stop
  };
};
