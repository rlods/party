import { mocked } from "ts-jest/utils";
import { asyncJsonp } from "../jsonp";
jest.mock("../jsonp");

// ------------------------------------------------------------------

import {
	DEFAULT_API,
	DeezerApiSearchResult,
	DeezerApiAlbum,
	DeezerApiPlaylist,
	DeezerApiTrack
} from "../deezer";
import { Album, Playlist, Track } from "../medias";

// ------------------------------------------------------------------

let ALBUM_COUNTER = 0;
let ARTIST_COUNTER = 0;
let PLAYLIST_COUNTER = 0;
let TRACK_COUNTER = 0;
let USER_COUNTER = 0;

const createFakeApiAlbum = (): DeezerApiAlbum => {
	const albumId = ALBUM_COUNTER++;
	const artistId = ARTIST_COUNTER++;
	return {
		artist: {
			id: artistId,
			name: "",
			picture_big: "",
			picture_small: ""
		},
		cover_big: "",
		cover_small: "",
		id: albumId,
		title: "",
		tracks: {
			data: [
				{
					album: {
						cover_big: "",
						cover_small: "",
						id: albumId,
						title: ""
					},
					artist: {
						id: artistId,
						name: "",
						picture_big: "",
						picture_small: ""
					},
					duration: 0,
					id: TRACK_COUNTER++,
					preview: "https://preview",
					readable: true,
					title: ""
				}
			]
		}
	};
};

const createFakeApiPlaylist = (): DeezerApiPlaylist => {
	const userId = USER_COUNTER++;
	return {
		creator: {
			id: userId,
			name: ""
		},
		id: PLAYLIST_COUNTER++,
		picture_big: "",
		picture_small: "",
		public: true,
		title: "",
		tracks: {
			data: [
				{
					album: {
						cover_big: "",
						cover_small: "",
						id: ALBUM_COUNTER++,
						title: ""
					},
					artist: {
						id: ARTIST_COUNTER++,
						name: "",
						picture_big: "",
						picture_small: ""
					},
					duration: 0,
					id: TRACK_COUNTER++,
					preview: "https://preview",
					readable: true,
					title: ""
				}
			]
		},
		user: {
			id: userId,
			name: ""
		}
	};
};

const createFakeApiTrack = (): DeezerApiTrack => ({
	album: {
		cover_big: "",
		cover_small: "",
		id: ALBUM_COUNTER++,
		title: ""
	},
	artist: {
		id: ARTIST_COUNTER++,
		name: "",
		picture_big: "",
		picture_small: ""
	},
	duration: 0,
	id: TRACK_COUNTER++,
	preview: "https://preview",
	readable: true,
	title: ""
});

// ------------------------------------------------------------------

describe("Providers Utilities", () => {
	it("loadAlbums - valid", async () => {
		const album1 = createFakeApiAlbum();
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<DeezerApiAlbum>(album1)
		);
		await expect(DEFAULT_API.loadAlbums(["42"])).resolves.toEqual<Album[]>([
			{
				artist: {
					id: `${album1.artist.id}`,
					link: `https://www.deezer.com/artist/${album1.artist.id}`,
					name: "",
					picture_big: "",
					picture_small: ""
				},
				id: `${album1.id}`,
				link: `https://www.deezer.com/album/${album1.id}`,
				picture_big: "",
				picture_small: "",
				provider: "deezer",
				title: "",
				tracks: [
					{
						album: {
							id: `${album1.tracks!.data[0].album.id}`,
							link: `https://www.deezer.com/album/${
								album1.tracks!.data[0].album.id
							}`,
							picture_big: "",
							picture_small: "",
							title: ""
						},
						artist: {
							id: `${album1.tracks!.data[0].artist.id}`,
							link: `https://www.deezer.com/artist/${
								album1.tracks!.data[0].artist.id
							}`,
							name: "",
							picture_big: "",
							picture_small: ""
						},
						duration: 0,
						id: `${album1.tracks!.data[0].id}`,
						link: `https://www.deezer.com/track/${
							album1.tracks!.data[0].id
						}`,
						preview: "https://preview",
						provider: "deezer",
						title: "",
						type: "track"
					}
				],
				type: "album"
			}
		]);
	});

	// --------------------------------------------------------------

	it("loadAlbums - edge", async () => {
		await expect(DEFAULT_API.loadAlbums([])).resolves.toEqual<Album[]>([]);
	});

	// --------------------------------------------------------------

	it("loadAlbums - invalid", async () => {
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<DeezerApiAlbum>({
				error: { code: 200, message: "toto", type: "toto" },
				artist: {
					id: 0,
					name: "",
					picture_big: "",
					picture_small: ""
				},
				cover_big: "",
				cover_small: "",
				id: 0,
				title: "",
				tracks: { data: [] }
			})
		);
		await expect(DEFAULT_API.loadAlbums(["42"])).resolves.toEqual<Album[]>(
			[]
		); // invalid albumds are just ignored
	});

	// --------------------------------------------------------------

	it("loadPlaylists - valid", async () => {
		const playlist1 = createFakeApiPlaylist();
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<DeezerApiPlaylist>(playlist1)
		);
		await expect(DEFAULT_API.loadPlaylists(["42"])).resolves.toEqual<
			Playlist[]
		>([
			{
				id: `${playlist1.id}`,
				link: `https://www.deezer.com/playlist/${playlist1.id}`,
				picture_big: "",
				picture_small: "",
				provider: "deezer",
				title: "",
				tracks: [
					{
						album: {
							id: `${playlist1.tracks!.data[0].album.id}`,
							link: `https://www.deezer.com/album/${
								playlist1.tracks!.data[0].album.id
							}`,
							picture_big: "",
							picture_small: "",
							title: ""
						},
						artist: {
							id: `${playlist1.tracks!.data[0].artist.id}`,
							link: `https://www.deezer.com/artist/${
								playlist1.tracks!.data[0].artist.id
							}`,
							name: "",
							picture_big: "",
							picture_small: ""
						},
						duration: 0,
						id: `${playlist1.tracks!.data[0].id}`,
						link: `https://www.deezer.com/track/${
							playlist1.tracks!.data[0].id
						}`,
						preview: "https://preview",
						provider: "deezer",
						title: "",
						type: "track"
					}
				],
				type: "playlist",
				user: {
					id: `${playlist1.user!.id}`,
					link: `https://www.deezer.com/profile/${
						playlist1.user!.id
					}`,
					name: ""
				}
			}
		]);
	});

	// --------------------------------------------------------------

	it("loadPlaylists - edge", async () => {
		await expect(DEFAULT_API.loadPlaylists([])).resolves.toEqual<
			Playlist[]
		>([]);
	});

	// --------------------------------------------------------------

	it("loadTracks - valid", async () => {
		const track1 = createFakeApiTrack();
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<DeezerApiTrack>(track1)
		);
		await expect(DEFAULT_API.loadTracks(["42"])).resolves.toEqual<Track[]>([
			{
				album: {
					id: `${track1.album.id}`,
					link: `https://www.deezer.com/album/${track1.album.id}`,
					picture_big: "",
					picture_small: "",
					title: ""
				},
				artist: {
					id: `${track1.artist.id}`,
					link: `https://www.deezer.com/artist/${track1.artist.id}`,
					name: "",
					picture_big: "",
					picture_small: ""
				},
				duration: 0,
				id: `${track1.id}`,
				link: `https://www.deezer.com/track/${track1.id}`,
				preview: "https://preview",
				provider: "deezer",
				title: "",
				type: "track"
			}
		]);
	});

	// --------------------------------------------------------------

	it("loadTracks - edge", async () => {
		await expect(DEFAULT_API.loadTracks([])).resolves.toEqual<Track[]>([]);
	});

	// --------------------------------------------------------------

	it("searchAlbums - valid", async () => {
		const album1 = createFakeApiAlbum();
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<DeezerApiSearchResult<DeezerApiAlbum>>({
				data: [album1],
				total: 1
			})
		);
		await expect(
			DEFAULT_API.searchAlbums("dummy", { limit: 10 })
		).resolves.toEqual<Album[]>([
			{
				artist: {
					id: `${album1.artist.id}`,
					link: `https://www.deezer.com/artist/${album1.artist.id}`,
					name: "",
					picture_big: "",
					picture_small: ""
				},
				id: `${album1.id}`,
				link: `https://www.deezer.com/album/${album1.id}`,
				picture_big: "",
				picture_small: "",
				provider: "deezer",
				title: "",
				tracks: [
					{
						album: {
							id: `${album1.tracks!.data[0].album.id}`,
							link: `https://www.deezer.com/album/${
								album1.tracks!.data[0].album.id
							}`,
							picture_big: "",
							picture_small: "",
							title: ""
						},
						artist: {
							id: `${album1.tracks!.data[0].artist.id}`,
							link: `https://www.deezer.com/artist/${
								album1.tracks!.data[0].artist.id
							}`,
							name: "",
							picture_big: "",
							picture_small: ""
						},
						duration: 0,
						id: `${album1.tracks!.data[0].id}`,
						link: `https://www.deezer.com/track/${
							album1.tracks!.data[0].id
						}`,
						preview: "https://preview",
						provider: "deezer",
						title: "",
						type: "track"
					}
				],
				type: "album"
			}
		]);
	});

	// --------------------------------------------------------------

	it("searchAlbums - edge", async () => {
		await expect(
			DEFAULT_API.searchAlbums("", { limit: 10 })
		).resolves.toEqual<Album[]>([]);
	});

	// --------------------------------------------------------------

	it("searchPlaylists - valid", async () => {
		const playlist1 = createFakeApiPlaylist();
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<DeezerApiSearchResult<DeezerApiPlaylist>>({
				data: [playlist1],
				total: 1
			})
		);
		await expect(
			DEFAULT_API.searchPlaylists("dummy", { limit: 10 })
		).resolves.toEqual<Playlist[]>([
			{
				id: `${playlist1.id}`,
				link: `https://www.deezer.com/playlist/${playlist1.id}`,
				picture_big: "",
				picture_small: "",
				provider: "deezer",
				title: "",
				tracks: [
					{
						album: {
							id: `${playlist1.tracks!.data[0].album.id}`,
							link: `https://www.deezer.com/album/${
								playlist1.tracks!.data[0].album.id
							}`,
							picture_big: "",
							picture_small: "",
							title: ""
						},
						artist: {
							id: `${playlist1.tracks!.data[0].artist.id}`,
							link: `https://www.deezer.com/artist/${
								playlist1.tracks!.data[0].artist.id
							}`,
							name: "",
							picture_big: "",
							picture_small: ""
						},
						duration: 0,
						id: `${playlist1.tracks!.data[0].id}`,
						link: `https://www.deezer.com/track/${
							playlist1.tracks!.data[0].id
						}`,
						preview: "https://preview",
						provider: "deezer",
						title: "",
						type: "track"
					}
				],
				type: "playlist",
				user: {
					id: `${playlist1.user!.id}`,
					link: `https://www.deezer.com/profile/${
						playlist1.user!.id
					}`,
					name: ""
				}
			}
		]);
	});

	// --------------------------------------------------------------

	it("searchPlaylists - edge", async () => {
		await expect(
			DEFAULT_API.searchPlaylists("", { limit: 10 })
		).resolves.toEqual<Playlist[]>([]);
	});

	// --------------------------------------------------------------

	it("searchTracks - valid", async () => {
		const track1 = createFakeApiTrack();
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<DeezerApiSearchResult<DeezerApiTrack>>({
				data: [track1],
				total: 1
			})
		);
		await expect(
			DEFAULT_API.searchTracks("dummy", { limit: 10 })
		).resolves.toEqual<Track[]>([
			{
				album: {
					id: `${track1.album.id}`,
					link: `https://www.deezer.com/album/${track1.album.id}`,
					picture_big: "",
					picture_small: "",
					title: ""
				},
				artist: {
					id: `${track1.artist.id}`,
					link: `https://www.deezer.com/artist/${track1.artist.id}`,
					name: "",
					picture_big: "",
					picture_small: ""
				},
				duration: 0,
				id: `${track1.id}`,
				link: `https://www.deezer.com/track/${track1.id}`,
				preview: "https://preview",
				provider: "deezer",
				title: "",
				type: "track"
			}
		]);
	});

	// --------------------------------------------------------------

	it("searchTracks - edge", async () => {
		await expect(
			DEFAULT_API.searchTracks("", { limit: 10 })
		).resolves.toEqual<Track[]>([]);
	});
});
