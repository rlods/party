// ------------------------------------------------------------------

let AUDIO_CONTEXT: AudioContext | null = null;

const getContext = () => {
  if (!AUDIO_CONTEXT) {
    AUDIO_CONTEXT = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }
  return AUDIO_CONTEXT;
};

const decodeAudioData = (encodedBuffer: ArrayBuffer): Promise<AudioBuffer> =>
  new Promise((resolve, reject) =>
    getContext().decodeAudioData(encodedBuffer, resolve, reject)
  );

// ------------------------------------------------------------------

// Fix Safari and iOS Audio Context
(() => {
  const fixAudioContext = () => {
    document.removeEventListener("click", fixAudioContext);
    document.removeEventListener("touchstart", fixAudioContext);
    console.log("Fixing audio context...");
    const context = getContext();
    // Create empty buffer, connect to output, play sound
    var buffer = context.createBuffer(1, 1, 22050);
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
  };
  document.addEventListener("click", fixAudioContext);
  document.addEventListener("touchstart", fixAudioContext);
})();

// ------------------------------------------------------------------

export type PlayerCallbacks = {
  onStart: () => void;
  onStop: () => void;
};

export const Player = () => {
  let analyserNode: AnalyserNode | null = null;
  let gainNode: GainNode | null = null;
  let node: AudioNode | null = null;

  const getNode = () => {
    if (!node) {
      const context = getContext();
      node = context.destination;

      gainNode = context.createGain();
      gainNode.gain.value = 1.0;
      gainNode.connect(node);
      node = gainNode;

      analyserNode = context.createAnalyser();
      analyserNode.fftSize = 128;
      // analyserNode.minDecibels = -90;
      // analyserNode.maxDecibels = -10;
      analyserNode.connect(node);
      node = analyserNode;
    }
    return node;
  };

  let buffer: AudioBuffer | null = null;
  let bufferUrl: string = "";

  let sourceNode: AudioBufferSourceNode | null = null;
  let sourceNodeStartTime = 0;
  let playCount = 0;

  const isPlaying = () => playCount > 0;

  const getPosition = () => {
    if (buffer && sourceNode) {
      return Math.floor(
        ((getContext().currentTime - sourceNodeStartTime) / buffer?.duration) *
          100
      );
    }
    return 0;
  };

  const loadAudioBuffer = (url: string): Promise<AudioBuffer> =>
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
            resolve(await decodeAudioData(req.response as ArrayBuffer));
          } catch (error) {
            console.log("An error occurred while decoding audio data");
            reject(error);
          }
        },
        false
      );
      req.send();
    });

  const play = async (url: string, offset: number) => {
    if (bufferUrl !== url) {
      console.log("Loading audio...", { url });
      buffer = await loadAudioBuffer(url);
      bufferUrl = url;
    }
    stop();
    playCount++;
    console.log("Starting audio...");
    sourceNode = getContext().createBufferSource();
    sourceNode.buffer = buffer;
    sourceNode.loop = false;
    sourceNode.loopStart = 0;
    sourceNode.loopEnd = 0;
    sourceNode.onended = () => {
      console.log("Audio terminated...");
      playCount--;
    };
    sourceNode.playbackRate.value = 1.0;
    sourceNode.connect(getNode());
    sourceNode.start(0, offset); // A new BufferSource must be created for each start
    sourceNodeStartTime = getContext().currentTime;
  };

  const stop = () => {
    if (null !== sourceNode) {
      console.log("Stopping audio...");
      sourceNode.stop();
      sourceNode = null;
      sourceNodeStartTime = 0;
    }
  };

  return {
    analyserNode,
    gainNode,
    getPosition,
    isPlaying,
    play,
    stop
  };
};
