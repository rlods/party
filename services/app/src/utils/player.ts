import {
	createAnalyzerNode,
	createGainNode,
	createSourceNode,
	getCurrentTime,
	getDestinationNode,
	getOrLoadAudioBuffer
} from "./audio";

// ------------------------------------------------------------------

export type Player = {
	isPlaying: () => boolean;
	getPlayingTrackID: () => string;
	getPlayingTrackPosition: () => number;
	getPlayingTrackPercent: () => number;
	play: (
		trackPosition: number,
		trackId: string,
		trackUrl: string,
		offset: number
	) => Promise<void>;
	stop: () => Promise<void>;
};

// ------------------------------------------------------------------

const PlayerImpl = (): Player => {
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
			_node = getDestinationNode();

			gainNode = createGainNode();
			gainNode.gain.value = 1.0;
			gainNode.connect(_node);
			_node = gainNode;

			analyserNode = createAnalyzerNode();
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
			return (getCurrentTime() - _sourceNodeStartTime) / _buffer.duration;
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
		_buffer = await getOrLoadAudioBuffer(trackUrl); // TODO: warning if loadBuffer takes long for some reason and user clicks stop before end, next part of this function will continue after stop have been requested
		console.debug("[Player] Starting audio...", {
			trackPosition,
			trackId,
			trackUrl
		});
		_trackId = trackId;
		_trackPosition = trackPosition;
		_sourceNode = createSourceNode();
		_sourceNode.buffer = _buffer;
		_sourceNode.loop = false;
		_sourceNode.loopStart = 0;
		_sourceNode.loopEnd = 0;
		_sourceNode.onended = () => {
			console.debug("[Player] Audio terminated...");
			_buffer = null;
			_sourceNode = null;
		};
		_sourceNode.playbackRate.value = 1.0;
		_sourceNode.connect(getOrCreateNode());
		_sourceNode.start(0, offset); // A new BufferSource must be created for each start
		_sourceNodeStartTime = getCurrentTime();
	};

	const stop = (): Promise<void> =>
		new Promise(resolve => {
			if (null !== _sourceNode) {
				console.debug("[Player] Stopping play...");
				_sourceNode.onended = () => {
					console.debug("[Player] Forced audio termination...");
					resolve();
				};
				_sourceNode.stop();
				_sourceNode = null;
				_sourceNodeStartTime = 0;
				_trackId = "";
				_trackPosition = -1;
			} else {
				resolve();
			}
		});

	return {
		getPlayingTrackID,
		getPlayingTrackPercent,
		getPlayingTrackPosition,
		isPlaying,
		play,
		stop
	};
};

// ------------------------------------------------------------------

export const QUEUE_PLAYER = PlayerImpl();

export const PREVIEW_PLAYER = PlayerImpl();
