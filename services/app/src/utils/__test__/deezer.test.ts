import { mocked } from "ts-jest/utils";
import { asyncJsonp } from "../jsonp";
jest.mock("../jsonp");

// ------------------------------------------------------------------

import {
	DEFAULT_API,
	ApiSearchResult,
	ApiAlbum,
	ApiPlaylist,
	ApiTrack
} from "../deezer";
import { Album, Playlist, Track } from "../medias";

// ------------------------------------------------------------------

let ALBUM_COUNTER = 0;
let ARTIST_COUNTER = 0;
let PLAYLIST_COUNTER = 0;
let TRACK_COUNTER = 0;
let USER_COUNTER = 0;

const createFakeApiAlbum = (): ApiAlbum => {
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

const createFakeApiPlaylist = (): ApiPlaylist => {
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

const createFakeApiTrack = (): ApiTrack => ({
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
			Promise.resolve<ApiAlbum>(album1)
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
				cover_big: "",
				cover_small: "",
				id: `${album1.id}`,
				link: `https://www.deezer.com/album/${album1.id}`,
				provider: "deezer",
				title: "",
				tracks: [
					{
						album: {
							cover_big: "",
							cover_small: "",
							id: `${album1.tracks!.data[0].album.id}`,
							link: `https://www.deezer.com/album/${
								album1.tracks!.data[0].album.id
							}`,
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
			Promise.resolve<ApiAlbum>({
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
		await expect(DEFAULT_API.loadAlbums(["42"])).rejects.toThrowError(
			"An error occured while loading media"
		);
	});

	// --------------------------------------------------------------

	it("loadPlaylists - valid", async () => {
		const playlist1 = createFakeApiPlaylist();
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<ApiPlaylist>(playlist1)
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
							cover_big: "",
							cover_small: "",
							id: `${playlist1.tracks!.data[0].album.id}`,
							link: `https://www.deezer.com/album/${
								playlist1.tracks!.data[0].album.id
							}`,
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
			Promise.resolve<ApiTrack>(track1)
		);
		await expect(DEFAULT_API.loadTracks(["42"])).resolves.toEqual<Track[]>([
			{
				album: {
					cover_big: "",
					cover_small: "",
					id: `${track1.album.id}`,
					link: `https://www.deezer.com/album/${track1.album.id}`,
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

	it("searchAlbums - valid - TODO", async () => {
		const album1 = createFakeApiAlbum();
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<ApiSearchResult<ApiAlbum>>({
				data: [album1],
				total: 1
			})
		);
		await expect(
			DEFAULT_API.searchAlbums("", { limit: 10 })
		).resolves.toEqual<Album[]>([
			{
				artist: {
					id: `${album1.artist.id}`,
					link: `https://www.deezer.com/artist/${album1.artist.id}`,
					name: "",
					picture_big: "",
					picture_small: ""
				},
				cover_big: "",
				cover_small: "",
				id: `${album1.id}`,
				link: `https://www.deezer.com/album/${album1.id}`,
				provider: "deezer",
				title: "",
				tracks: [
					{
						album: {
							cover_big: "",
							cover_small: "",
							id: `${album1.tracks!.data[0].album.id}`,
							link: `https://www.deezer.com/album/${
								album1.tracks!.data[0].album.id
							}`,
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

	it("searchPlaylists - valid - TODO", async () => {
		const playlist1 = createFakeApiPlaylist();
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<ApiSearchResult<ApiPlaylist>>({
				data: [playlist1],
				total: 1
			})
		);
		await expect(
			DEFAULT_API.searchPlaylists("", { limit: 10 })
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
							cover_big: "",
							cover_small: "",
							id: `${playlist1.tracks!.data[0].album.id}`,
							link: `https://www.deezer.com/album/${
								playlist1.tracks!.data[0].album.id
							}`,
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

	it("searchTracks - valid - TODO", async () => {
		const track1 = createFakeApiTrack();
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<ApiSearchResult<ApiTrack>>({
				data: [track1],
				total: 1
			})
		);
		await expect(
			DEFAULT_API.searchTracks("", { limit: 10 })
		).resolves.toEqual<Track[]>([
			{
				album: {
					cover_big: "",
					cover_small: "",
					id: `${track1.album.id}`,
					link: `https://www.deezer.com/album/${track1.album.id}`,
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
});
