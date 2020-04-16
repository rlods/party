import { mocked } from "ts-jest/utils";
import { asyncJsonp } from "../jsonp";
jest.mock("../jsonp");

// ------------------------------------------------------------------

import { DEFAULT_API, ApiSearchResult } from "../deezer";
import { Album, Playlist, Track } from "../medias";
import { ApiAlbum, ApiPlaylist, ApiTrack } from "../deezer";

// ------------------------------------------------------------------

describe("Providers Utilities", () => {
	it("load albums - valid", async () => {
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<ApiAlbum>({
				error: void 0,
				artist: {
					id: 43,
					name: "",
					picture_big: "",
					picture_small: ""
				},
				cover_big: "",
				cover_small: "",
				id: 42,
				title: "",
				tracks: { data: [] }
			})
		);
		await expect(DEFAULT_API.loadAlbums(["42"])).resolves.toEqual<Album[]>([
			{
				artist: {
					id: "43",
					link: "https://www.deezer.com/artist/43",
					name: "",
					picture_big: "",
					picture_small: ""
				},
				cover_big: "",
				cover_small: "",
				id: "42",
				link: "https://www.deezer.com/album/42",
				provider: "deezer",
				title: "",
				tracks: [],
				type: "album"
			}
		]);
	});

	// --------------------------------------------------------------

	it("load albums - invalid", async () => {
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

	it("load playlists - valid", async () => {
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<ApiPlaylist>({
				error: void 0,
				creator: {
					id: 43,
					name: ""
				},
				id: 42,
				picture_big: "",
				picture_small: "",
				public: true,
				title: "",
				tracks: { data: [] },
				user: {
					id: 44,
					name: ""
				}
			})
		);
		await expect(DEFAULT_API.loadPlaylists(["42"])).resolves.toEqual<
			Playlist[]
		>([
			{
				id: "42",
				link: "https://www.deezer.com/playlist/42",
				picture_big: "",
				picture_small: "",
				provider: "deezer",
				title: "",
				tracks: [],
				type: "playlist",
				user: {
					id: "43",
					link: "https://www.deezer.com/profile/43",
					name: ""
				}
			}
		]);
	});

	// --------------------------------------------------------------

	it("load tracks - valid", async () => {
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<ApiTrack>({
				error: void 0,
				album: {
					cover_big: "",
					cover_small: "",
					id: 43,
					title: ""
				},
				artist: {
					id: 44,
					name: "",
					picture_big: "",
					picture_small: ""
				},
				duration: 0,
				id: 42,
				preview: "",
				readable: true,
				title: ""
			})
		);
		await expect(DEFAULT_API.loadTracks(["42"])).resolves.toEqual<Track[]>([
			{
				album: {
					cover_big: "",
					cover_small: "",
					id: "43",
					link: "https://www.deezer.com/album/43",
					title: ""
				},
				artist: {
					id: "44",
					link: "https://www.deezer.com/artist/44",
					name: "",
					picture_big: "",
					picture_small: ""
				},
				duration: 0,
				id: "42",
				link: "https://www.deezer.com/track/42",
				preview: "",
				provider: "deezer",
				title: "",
				type: "track"
			}
		]);
	});

	// --------------------------------------------------------------

	it("search albums - valid - TODO", async () => {
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<ApiSearchResult<ApiAlbum>>({
				data: [],
				total: 0
			})
		);
		await expect(
			DEFAULT_API.searchAlbums("", { limit: 10 })
		).resolves.toEqual<Album[]>([]);
	});

	// --------------------------------------------------------------

	it("search playlists - valid - TODO", async () => {
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<ApiSearchResult<ApiPlaylist>>({
				data: [],
				total: 0
			})
		);
		await expect(
			DEFAULT_API.searchPlaylists("", { limit: 10 })
		).resolves.toEqual<Playlist[]>([]);
	});

	// --------------------------------------------------------------

	it("search tracks - valid - TODO", async () => {
		const mockedJsonp = mocked(asyncJsonp, true);
		mockedJsonp.mockImplementation((url, qs) =>
			Promise.resolve<ApiSearchResult<ApiTrack>>({
				data: [],
				total: 0
			})
		);
		await expect(
			DEFAULT_API.searchTracks("", { limit: 10 })
		).resolves.toEqual<Track[]>([]);
	});
});
