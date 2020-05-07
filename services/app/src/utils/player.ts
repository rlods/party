import {
	createAnalyzerNode,
	createGainNode,
	createSourceNode,
	getCurrentTime,
	getDestinationNode,
	getOrLoadAudioBuffer
} from "./audio";
import { PlayMode } from "./rooms";
import { TrackAccess } from "./medias";

// ------------------------------------------------------------------

export const generateRandomPosition = () => Math.floor(Math.random() * 1000000);

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
		offset: number,
		options?: {
			playmode: PlayMode;
		}
	) => Promise<void>;
	stop: () => Promise<void>;
};

// ------------------------------------------------------------------

const PlayerImpl = (): Player => {
	let _analyserNode: AnalyserNode | null = null;
	let _gainNode: GainNode | null = null;
	let _node: AudioNode | null = null;
	let _duration = 0;
	let _sourceNode: AudioBufferSourceNode | null = null;
	let _startTime = 0;
	let _trackId = "";
	let _trackPosition = -1;

	const getOrCreateNode = () => {
		if (!_node) {
			_node = getDestinationNode();

			_gainNode = createGainNode();
			_gainNode.gain.value = 1.0;
			_gainNode.connect(_node);
			_node = _gainNode;

			_analyserNode = createAnalyzerNode();
			_analyserNode.fftSize = 128;
			// _analyserNode.minDecibels = -90;
			// _analyserNode.maxDecibels = -10;
			_analyserNode.connect(_node);
			_node = _analyserNode;
		}
		return _node;
	};

	const isPlaying = () => !!_sourceNode;

	const getPlayingTrackID = () => _trackId;

	const getPlayingTrackPosition = () => _trackPosition;

	// Percentage [0, 1]
	const getPlayingTrackPercent = () => {
		if (_sourceNode) {
			return (getCurrentTime() - _startTime) / _duration;
		}
		return 0;
	};

	const play = async (
		trackPosition: number,
		trackId: string,
		trackUrl: string,
		offset: number,
		options?: {
			playmode: PlayMode;
		}
	) => {
		await stop();
		const buffer = await getOrLoadAudioBuffer(trackUrl); // TODO: warning if loadBuffer takes long for some reason and user clicks stop before end, next part of this function will continue after stop have been requested
		console.debug("[Player] Starting audio...", {
			trackPosition,
			trackId,
			trackUrl
		});
		_duration = buffer.duration;
		_trackId = trackId;
		_trackPosition = trackPosition;
		_sourceNode = createSourceNode();
		_sourceNode.buffer = buffer;
		_sourceNode.loop = false;
		_sourceNode.loopStart = 0;
		_sourceNode.loopEnd = 0;
		_sourceNode.onended = () => {
			console.debug("[Player] Audio terminated...");
			_duration = 0;
			_sourceNode = null;
			_startTime = 0;
			_trackId = "";
			if (options?.playmode === "shuffle") {
				_trackPosition += generateRandomPosition();
			} else {
				_trackPosition++;
			}
		};
		_sourceNode.playbackRate.value = 1.0;
		_sourceNode.connect(getOrCreateNode());
		_sourceNode.start(0, offset); // A new BufferSource must be created for each start
		_startTime = getCurrentTime();
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
				_duration = 0;
				_sourceNode = null;
				_startTime = 0;
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

export const computePlayerNextPosition = (
	playStarted: boolean,
	playing: boolean,
	playingTrackID: string,
	playingTrackIndex: number,
	tracks: ReadonlyArray<TrackAccess>,
	trackIndex: number
) => {
	if (!playStarted || tracks.length === 0) {
		return -1;
	}
	let nextIndex = -1;
	if (playingTrackIndex !== trackIndex) {
		if (playing) {
			// User has clicked an other track or added/removed a track in queue
			if (playingTrackID !== tracks[trackIndex].id) {
				nextIndex = trackIndex;
			}
		} else {
			// Not playing which means previous track has terminated
			nextIndex = playingTrackIndex >= 0 ? playingTrackIndex : trackIndex;
		}
	} else if (playingTrackID !== tracks[trackIndex].id) {
		// User has deleted playing track
		nextIndex = trackIndex;
	}
	return nextIndex;
};

// ------------------------------------------------------------------

export const QUEUE_PLAYER = PlayerImpl();

export const PREVIEW_PLAYER = PlayerImpl();
