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

const loadAudioBuffer = (trackId: string, url: string): Promise<AudioBuffer> =>
	new Promise((resolve, reject) => {
		const req = new XMLHttpRequest();
		req.open("GET", url, true);
		req.responseType = "arraybuffer";
		req.addEventListener(
			"error",
			() => reject(new Error("player.errors.cannot_load_audio_buffer")),
			false
		);
		req.addEventListener(
			"load",
			async () => {
				try {
					resolve(await decodeAudioData(req.response as ArrayBuffer));
				} catch (error) {
					console.debug(
						"An error occurred while decoding audio data",
						{
							trackId,
							url
						}
					);
					reject(new Error("player.errors.cannot_decode_audio_data"));
				}
			},
			false
		);
		req.send();
	});

const AUDIO_BUFFER_CACHES: Array<{ buffer: AudioBuffer; url: string }> = [];
const AUDIO_BUFFER_CACHES_MAX_SIZE = 10;

const loadAudioBufferWithCache = async (
	trackId: string,
	url: string
): Promise<AudioBuffer> => {
	if (!url) {
		console.error("Track has invalid URL", { trackId });
		throw new Error("Invalid URL");
	}
	let buffer: AudioBuffer | null = null;
	const index = AUDIO_BUFFER_CACHES.findIndex(item => item.url === url);
	if (index >= 0) {
		// Found: extract old buffer, it will be repush at the end of cache
		console.debug("Reusing cached audio buffer...", { trackId, url });
		buffer = AUDIO_BUFFER_CACHES.splice(index, 1)[0].buffer;
	} else {
		// Not Found
		console.debug("Loading audio buffer...", { trackId, url });
		buffer = await loadAudioBuffer(trackId, url);
	}
	AUDIO_BUFFER_CACHES.push({ buffer, url });
	AUDIO_BUFFER_CACHES.splice(AUDIO_BUFFER_CACHES_MAX_SIZE);
	return buffer;
};

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
	let _sourceNode: AudioBufferSourceNode | null = null;
	let _sourceNodeStartTime = 0;
	let _trackId = "";
	let _trackPosition = -1;

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

	const getPlayingTrackID = () => _trackId;

	const getPlayingTrackPosition = () => _trackPosition;

	// Percentage [0, 1]
	const getPlayingTrackPercent = () => {
		if (_buffer && _sourceNode) {
			return (
				(getContext().currentTime - _sourceNodeStartTime) /
				_buffer.duration
			);
		}
		return 0;
	};

	const play = async (
		trackPosition: number,
		trackId: string,
		trackUrl: string,
		offset: number
	) => {
		await stop();
		_buffer = await loadAudioBufferWithCache(trackId, trackUrl); // TODO: warning if loadBuffer takes long for some reason and user clicks stop before end, next part of this function will continue after stop have been requested
		console.debug("Starting audio...", {
			trackPosition,
			trackId,
			trackUrl
		});
		_trackId = trackId;
		_trackPosition = trackPosition;
		_sourceNode = getContext().createBufferSource();
		_sourceNode.buffer = _buffer;
		_sourceNode.loop = false;
		_sourceNode.loopStart = 0;
		_sourceNode.loopEnd = 0;
		_sourceNode.onended = () => {
			console.debug("Audio terminated...");
			_buffer = null;
			_sourceNode = null;
			if (chainPlay) {
				_trackPosition++;
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
				_trackPosition = -1;
			} else {
				resolve();
			}
		});

	return {
		analyserNode,
		gainNode,
		getPlayingTrackID,
		getPlayingTrackPercent,
		getPlayingTrackPosition,
		isPlaying,
		play,
		stop
	};
};
