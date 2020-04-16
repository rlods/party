const AUDIO_BUFFER_CACHES: Array<{ buffer: AudioBuffer; url: string }> = [];
const AUDIO_BUFFER_CACHES_MAX_SIZE = 10;
let AUDIO_CONTEXT: AudioContext | null = null;

// ------------------------------------------------------------------

const getContext = (): AudioContext => {
	if (!AUDIO_CONTEXT) {
		console.debug("[Audio] Creating context");
		AUDIO_CONTEXT = new (window.AudioContext ||
			(window as any).webkitAudioContext)();
	}
	return AUDIO_CONTEXT;
};

// ------------------------------------------------------------------

export const createAnalyzerNode = () => getContext().createAnalyser();

// ------------------------------------------------------------------

export const createGainNode = () => getContext().createGain();

// ------------------------------------------------------------------

export const createSourceNode = () => getContext().createBufferSource();

// ------------------------------------------------------------------

export const getCurrentTime = () => getContext().currentTime;

// ------------------------------------------------------------------

export const getDestinationNode = () => getContext().destination;

// ------------------------------------------------------------------

export const decodeAudioData = (
	encodedBuffer: ArrayBuffer
): Promise<AudioBuffer> =>
	new Promise((resolve, reject) =>
		getContext().decodeAudioData(encodedBuffer, resolve, reject)
	);

// ------------------------------------------------------------------

export const loadAudioBuffer = (url: string): Promise<AudioBuffer> =>
	new Promise((resolve, reject) => {
		const req = new XMLHttpRequest();
		req.open("GET", url, true);
		req.responseType = "arraybuffer";
		req.addEventListener(
			"error",
			() => reject(new Error("audio.errors.cannot_load_audio_buffer")),
			false
		);
		req.addEventListener(
			"load",
			async () => {
				try {
					resolve(await decodeAudioData(req.response as ArrayBuffer));
				} catch (error) {
					console.debug(
						"[Audio] An error occurred while decoding data",
						{ error, url }
					);
					reject(new Error("audio.errors.cannot_decode_audio_data"));
				}
			},
			false
		);
		req.send();
	});

// ------------------------------------------------------------------

export const getOrLoadAudioBuffer = async (
	url: string
): Promise<AudioBuffer> => {
	if (!url) {
		throw new Error("URL is invalid");
	}
	let buffer: AudioBuffer | null = null;
	const index = AUDIO_BUFFER_CACHES.findIndex(item => item.url === url);
	if (index >= 0) {
		// Found: extract old buffer, it will be repush at the end of cache
		console.debug("[Audio] Reusing cached buffer...", {
			url
		});
		buffer = AUDIO_BUFFER_CACHES.splice(index, 1)[0].buffer;
	} else {
		// Not Found
		console.debug("[Audio] Loading buffer...", { url });
		buffer = await loadAudioBuffer(url);
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
		console.debug("[Audio] Fixing context...");
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
