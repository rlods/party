import { mocked } from "ts-jest/utils";
import { Album, Playlist, Track } from "../../medias";
import {
	getDeezerApi,
	DeezerApiSearchResult,
	DeezerApiAlbum,
	DeezerApiPlaylist,
	DeezerApiTrack
} from "../deezer";
import { callProxy } from "../../proxy";
jest.mock("../../proxy");

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
			name: ""
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
						name: ""
					},
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
						name: ""
					},
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
		name: ""
	},
	id: TRACK_COUNTER++,
	preview: "https://preview",
	readable: true,
	title: ""
});

// ------------------------------------------------------------------

describe("Providers Utilities", () => {
	it("loadAlbums - valid", async () => {
		const album1 = createFakeApiAlbum();
		const mockedCallProxy = mocked(callProxy, true);
		mockedCallProxy.mockImplementation((path, params) =>
			Promise.resolve<DeezerApiAlbum>(album1)
		);
		await expect(getDeezerApi().loadAlbums(["42"])).resolves.toEqual<
			Album[]
		>([
			{
				artist: {
					id: `${album1.artist.id}`,
					link: `https://www.deezer.com/artist/${album1.artist.id}`,
					name: ""
				},
				id: `${album1.id}`,
				link: `https://www.deezer.com/album/${album1.id}`,
				name: "",
				picture_big: "",
				picture_small: "",
				provider: "deezer",
				tracks: [
					{
						album: {
							id: `${album1.tracks!.data[0].album!.id}`,
							link: `https://www.deezer.com/album/${
								album1.tracks!.data[0].album!.id
							}`,
							name: "",
							picture_big: "",
							picture_small: ""
						},
						artist: {
							id: `${album1.tracks!.data[0].artist.id}`,
							link: `https://www.deezer.com/artist/${
								album1.tracks!.data[0].artist.id
							}`,
							name: ""
						},
						id: `${album1.tracks!.data[0].id}`,
						link: `https://www.deezer.com/track/${
							album1.tracks!.data[0].id
						}`,
						name: "",
						preview: "https://preview",
						provider: "deezer",
						type: "track"
					}
				],
				type: "album"
			}
		]);
	});

	// --------------------------------------------------------------

	it("loadAlbums - edge", async () => {
		await expect(getDeezerApi().loadAlbums([])).resolves.toEqual<Album[]>(
			[]
		);
	});

	// --------------------------------------------------------------

	it("loadAlbums - invalid", async () => {
		const mockedCallProxy = mocked(callProxy, true);
		mockedCallProxy.mockImplementation((path, params) =>
			Promise.resolve<DeezerApiAlbum>({
				error: { code: 200, message: "toto", type: "toto" },
				artist: {
					id: 0,
					name: ""
				},
				cover_big: "",
				cover_small: "",
				id: 0,
				title: "",
				tracks: { data: [] }
			})
		);
		await expect(getDeezerApi().loadAlbums(["42"])).resolves.toEqual<
			Album[]
		>([]); // invalid albumIds are just ignored
	});

	// --------------------------------------------------------------

	it("loadPlaylists - valid", async () => {
		const playlist1 = createFakeApiPlaylist();
		const mockedCallProxy = mocked(callProxy, true);
		mockedCallProxy.mockImplementation((path, params) =>
			Promise.resolve<DeezerApiPlaylist>(playlist1)
		);
		await expect(getDeezerApi().loadPlaylists(["42"])).resolves.toEqual<
			Playlist[]
		>([
			{
				id: `${playlist1.id}`,
				link: `https://www.deezer.com/playlist/${playlist1.id}`,
				name: "",
				picture_big: "",
				picture_small: "",
				provider: "deezer",
				tracks: [
					{
						album: {
							id: `${playlist1.tracks!.data[0].album!.id}`,
							link: `https://www.deezer.com/album/${
								playlist1.tracks!.data[0].album!.id
							}`,
							name: "",
							picture_big: "",
							picture_small: ""
						},
						artist: {
							id: `${playlist1.tracks!.data[0].artist.id}`,
							link: `https://www.deezer.com/artist/${
								playlist1.tracks!.data[0].artist.id
							}`,
							name: ""
						},
						id: `${playlist1.tracks!.data[0].id}`,
						link: `https://www.deezer.com/track/${
							playlist1.tracks!.data[0].id
						}`,
						name: "",
						preview: "https://preview",
						provider: "deezer",
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
		await expect(getDeezerApi().loadPlaylists([])).resolves.toEqual<
			Playlist[]
		>([]);
	});

	// --------------------------------------------------------------

	it("loadTracks - valid", async () => {
		const track1 = createFakeApiTrack();
		const mockedCallProxy = mocked(callProxy, true);
		mockedCallProxy.mockImplementation((path, params) =>
			Promise.resolve<DeezerApiTrack>(track1)
		);
		await expect(getDeezerApi().loadTracks(["42"])).resolves.toEqual<
			Track[]
		>([
			{
				album: {
					id: `${track1.album!.id}`,
					link: `https://www.deezer.com/album/${track1.album!.id}`,
					name: "",
					picture_big: "",
					picture_small: ""
				},
				artist: {
					id: `${track1.artist.id}`,
					link: `https://www.deezer.com/artist/${track1.artist.id}`,
					name: ""
				},
				id: `${track1.id}`,
				link: `https://www.deezer.com/track/${track1.id}`,
				name: "",
				preview: "https://preview",
				provider: "deezer",
				type: "track"
			}
		]);
	});

	// --------------------------------------------------------------

	it("loadTracks - edge", async () => {
		await expect(getDeezerApi().loadTracks([])).resolves.toEqual<Track[]>(
			[]
		);
	});

	// --------------------------------------------------------------

	it("searchAlbums - valid", async () => {
		const album1 = createFakeApiAlbum();
		const mockedCallProxy = mocked(callProxy, true);
		mockedCallProxy.mockImplementation((path, params) =>
			Promise.resolve<DeezerApiSearchResult<DeezerApiAlbum>>({
				data: [album1],
				total: 1
			})
		);
		await expect(
			getDeezerApi().searchAlbums("dummy", { limit: 10, offset: 0 })
		).resolves.toEqual<Album[]>([
			{
				artist: {
					id: `${album1.artist.id}`,
					link: `https://www.deezer.com/artist/${album1.artist.id}`,
					name: ""
				},
				id: `${album1.id}`,
				link: `https://www.deezer.com/album/${album1.id}`,
				name: "",
				picture_big: "",
				picture_small: "",
				provider: "deezer",
				tracks: [
					{
						album: {
							id: `${album1.tracks!.data[0].album!.id}`,
							link: `https://www.deezer.com/album/${
								album1.tracks!.data[0].album!.id
							}`,
							name: "",
							picture_big: "",
							picture_small: ""
						},
						artist: {
							id: `${album1.tracks!.data[0].artist.id}`,
							link: `https://www.deezer.com/artist/${
								album1.tracks!.data[0].artist.id
							}`,
							name: ""
						},
						id: `${album1.tracks!.data[0].id}`,
						link: `https://www.deezer.com/track/${
							album1.tracks!.data[0].id
						}`,
						name: "",
						preview: "https://preview",
						provider: "deezer",
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
			getDeezerApi().searchAlbums("", { limit: 10, offset: 0 })
		).resolves.toEqual<Album[]>([]);
	});

	// --------------------------------------------------------------

	it("searchPlaylists - valid", async () => {
		const playlist1 = createFakeApiPlaylist();
		const mockedCallProxy = mocked(callProxy, true);
		mockedCallProxy.mockImplementation((path, params) =>
			Promise.resolve<DeezerApiSearchResult<DeezerApiPlaylist>>({
				data: [playlist1],
				total: 1
			})
		);
		await expect(
			getDeezerApi().searchPlaylists("dummy", { limit: 10, offset: 0 })
		).resolves.toEqual<Playlist[]>([
			{
				id: `${playlist1.id}`,
				link: `https://www.deezer.com/playlist/${playlist1.id}`,
				name: "",
				picture_big: "",
				picture_small: "",
				provider: "deezer",
				tracks: [
					{
						album: {
							id: `${playlist1.tracks!.data[0].album!.id}`,
							link: `https://www.deezer.com/album/${
								playlist1.tracks!.data[0].album!.id
							}`,
							name: "",
							picture_big: "",
							picture_small: ""
						},
						artist: {
							id: `${playlist1.tracks!.data[0].artist.id}`,
							link: `https://www.deezer.com/artist/${
								playlist1.tracks!.data[0].artist.id
							}`,
							name: ""
						},
						id: `${playlist1.tracks!.data[0].id}`,
						link: `https://www.deezer.com/track/${
							playlist1.tracks!.data[0].id
						}`,
						name: "",
						preview: "https://preview",
						provider: "deezer",
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
			getDeezerApi().searchPlaylists("", { limit: 10, offset: 0 })
		).resolves.toEqual<Playlist[]>([]);
	});

	// --------------------------------------------------------------

	it("searchTracks - valid", async () => {
		const track1 = createFakeApiTrack();
		const mockedCallProxy = mocked(callProxy, true);
		mockedCallProxy.mockImplementation((path, params) =>
			Promise.resolve<DeezerApiSearchResult<DeezerApiTrack>>({
				data: [track1],
				total: 1
			})
		);
		await expect(
			getDeezerApi().searchTracks("dummy", { limit: 10, offset: 0 })
		).resolves.toEqual<Track[]>([
			{
				album: {
					id: `${track1.album!.id}`,
					link: `https://www.deezer.com/album/${track1.album!.id}`,
					name: "",
					picture_big: "",
					picture_small: ""
				},
				artist: {
					id: `${track1.artist.id}`,
					link: `https://www.deezer.com/artist/${track1.artist.id}`,
					name: ""
				},
				id: `${track1.id}`,
				link: `https://www.deezer.com/track/${track1.id}`,
				name: "",
				preview: "https://preview",
				provider: "deezer",
				type: "track"
			}
		]);
	});

	// --------------------------------------------------------------

	it("searchTracks - edge", async () => {
		await expect(
			getDeezerApi().searchTracks("", { limit: 10, offset: 0 })
		).resolves.toEqual<Track[]>([]);
	});
});
