// ------------------------------------------------------------------

let AUDIO_CONTEXT: AudioContext | null = null;

const getContext = () => {
  if (!AUDIO_CONTEXT) {
    AUDIO_CONTEXT = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }
  return AUDIO_CONTEXT;
};

// ------------------------------------------------------------------

export type PlayerCallbacks = {
  onStart: () => void;
  onStop: () => void;
};

export const Player = () => {
  let analyserNode: AnalyserNode | null = null;
  let gainNode: GainNode | null = null;
  let node: AudioNode | null = null;

  const decodeAudioData = (encodedBuffer: ArrayBuffer): Promise<AudioBuffer> =>
    new Promise((resolve, reject) =>
      getContext().decodeAudioData(encodedBuffer, resolve, reject)
    );

  const getNode = () => {
    if (!node) {
      const context = getContext();

      gainNode = context.createGain();
      gainNode.gain.value = 1.0;
      gainNode.connect(context.destination);

      analyserNode = context.createAnalyser();
      analyserNode.fftSize = 128;
      // analyserNode.minDecibels = -90;
      // analyserNode.maxDecibels = -10;
      analyserNode.connect(gainNode);

      node = analyserNode;
    }
    return node;
  };

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
  let playCount = 0;

  const isPlaying = () => playCount > 0;

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

  const play = (offset: number) => {
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
    isPlaying,
    load,
    play,
    stop
  };
};
