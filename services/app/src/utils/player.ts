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
          console.debug("An error occurred while decoding audio data");
          reject(error);
        }
      },
      false
    );
    req.send();
  });

// ------------------------------------------------------------------

// Fix Safari and iOS Audio Context
(() => {
  const fixAudioContext = () => {
    document.removeEventListener("click", fixAudioContext);
    document.removeEventListener("touchstart", fixAudioContext);
    console.debug("Fixing audio context...");
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

export const Player = (chainPlay: boolean) => {
  let analyserNode: AnalyserNode | null = null;
  let gainNode: GainNode | null = null;
  let _node: AudioNode | null = null;
  let _buffer: AudioBuffer | null = null;
  let _bufferUrl: string = "";
  let _sourceNode: AudioBufferSourceNode | null = null;
  let _sourceNodeStartTime = 0;
  let _position = -1;

  const getOrCreateNode = () => {
    if (!_node) {
      const context = getContext();
      _node = context.destination;

      gainNode = context.createGain();
      gainNode.gain.value = 1.0;
      gainNode.connect(_node);
      _node = gainNode;

      analyserNode = context.createAnalyser();
      analyserNode.fftSize = 128;
      // analyserNode.minDecibels = -90;
      // analyserNode.maxDecibels = -10;
      analyserNode.connect(_node);
      _node = analyserNode;
    }
    return _node;
  };

  const isPlaying = () => !!_sourceNode;

  const getPlayingPosition = () => _position;

  // Percentage [0, 1]
  const getTrackPercent = () => {
    if (_buffer && _sourceNode) {
      return (
        (getContext().currentTime - _sourceNodeStartTime) / _buffer?.duration
      );
    }
    return 0;
  };

  const _loadBuffer = async (url: string) => {
    // TODO: cache N last audio buffers
    if (_bufferUrl !== url) {
      console.debug("Loading audio...", { url });
      _buffer = await loadAudioBuffer(url);
      _bufferUrl = url;
    }
  };

  const play = async (position: number, url: string, offset: number) => {
    await stop();
    await _loadBuffer(url); // TODO: warning if loadBuffer takes long for some reason and user clicks stop before end, next part of this function will continue after stop have been requested
    console.debug("Starting audio...", { position, url });
    _position = position;
    _sourceNode = getContext().createBufferSource();
    _sourceNode.buffer = _buffer;
    _sourceNode.loop = false;
    _sourceNode.loopStart = 0;
    _sourceNode.loopEnd = 0;
    _sourceNode.onended = () => {
      console.debug("Audio terminated...");
      if (chainPlay) {
        _position++;
      }
    };
    _sourceNode.playbackRate.value = 1.0;
    _sourceNode.connect(getOrCreateNode());
    _sourceNode.start(0, offset); // A new BufferSource must be created for each start
    _sourceNodeStartTime = getContext().currentTime;
  };

  const stop = async (): Promise<void> =>
    new Promise(resolve => {
      if (null !== _sourceNode) {
        console.debug("Stopping audio...");
        _sourceNode.onended = () => {
          console.debug("Forced audio termination...");
          resolve();
        };
        _sourceNode.stop();
        _sourceNode = null;
        _sourceNodeStartTime = 0;
        _position = -1;
      } else {
        resolve();
      }
    });

  return {
    analyserNode,
    gainNode,
    getPlayingPosition,
    getTrackPercent,
    isPlaying,
    play,
    stop
  };
};
