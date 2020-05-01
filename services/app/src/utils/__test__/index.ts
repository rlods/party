import { Album, Playlist, Track, MediaAccess, Media } from "../medias";

// ------------------------------------------------------------------

let ALBUM_COUNTER = 0;
let PLAYLIST_COUNTER = 0;
let TRACK_COUNTER = 0;

export const extractAccess = ({ id, provider, type }: Media): MediaAccess => ({
	id,
	provider,
	type
});

export const createFakeAlbum = (tracksCount = 0): Album => ({
	artist: {
		id: "",
		link: "",
		name: ""
	},
	id: `${ALBUM_COUNTER++}`,
	link: "",
	name: "",
	picture_big: "",
	picture_small: "",
	provider: "deezer",
	tracks: createFakeTracks(tracksCount),
	type: "album"
});

export const createFakePlaylist = (tracksCount = 0): Playlist => ({
	id: `${PLAYLIST_COUNTER++}`,
	link: "",
	name: "",
	picture_big: "",
	picture_small: "",
	provider: "deezer",
	tracks: createFakeTracks(tracksCount),
	type: "playlist",
	user: {
		id: "",
		link: "",
		name: ""
	}
});

export const createFakeTrack = (): Track => ({
	album: {
		id: "",
		link: "",
		name: "",
		picture_big: "",
		picture_small: ""
	},
	artist: {
		id: "",
		name: "",
		link: ""
	},
	id: `${TRACK_COUNTER++}`,
	link: "",
	name: "",
	preview: "",
	provider: "deezer",
	type: "track"
});

export const createFakeTracks = (tracksCount = 1): Track[] => {
	const res: Track[] = [];
	for (let i = 0; i < tracksCount; ++i) {
		res.push(createFakeTrack());
	}
	return res;
};
