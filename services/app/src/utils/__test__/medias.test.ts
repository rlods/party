import { createFakeAlbum, createFakePlaylist, createFakeTrack } from ".";
import {
	ContextualizedTrackAccess,
	findMedia,
	findPreview,
	extractTracks,
	findContextFromTrackIndex
} from "../medias";

// ------------------------------------------------------------------

describe("Medias Utilities", () => {
	it("findMedia - valid", () => {
		const album1 = createFakeAlbum();

		expect(
			findMedia(
				album1,
				{
					deezer: {
						album: { [album1.id]: album1 },
						playlist: {},
						track: {}
					}
				},
				[]
			)
		).toEqual(album1);

		expect(
			findMedia(
				album1,
				{
					deezer: {
						album: {},
						playlist: {},
						track: {}
					}
				},
				[album1]
			)
		).toEqual(album1);
	});

	// --------------------------------------------------------------

	it("findMedia - edge", () => {
		const album1 = createFakeAlbum();

		expect(
			findMedia(
				{ id: "", provider: "deezer", type: "album" },
				{
					deezer: {
						album: { [album1.id]: album1 },
						playlist: {},
						track: {}
					}
				},
				[]
			)
		).toEqual(void 0);

		expect(
			findMedia(
				{ id: "", provider: "deezer", type: "album" },
				{
					deezer: {
						album: {},
						playlist: {},
						track: {}
					}
				},
				[album1]
			)
		).toEqual(void 0);
	});

	// --------------------------------------------------------------

	it("findPreview - valid", () => {
		const album1 = createFakeAlbum(2);
		const playlist1 = createFakePlaylist(2);
		const track1 = createFakeTrack();

		expect(
			findPreview(
				album1,
				{
					deezer: {
						album: { [album1.id]: album1 },
						playlist: {},
						track: {}
					}
				},
				[]
			)
		).toEqual(album1.tracks![0]);

		expect(
			findPreview(
				album1,
				{
					deezer: {
						album: {},
						playlist: {},
						track: {}
					}
				},
				[album1]
			)
		).toEqual(album1.tracks![0]);

		expect(
			findPreview(
				playlist1,
				{
					deezer: {
						album: {},
						playlist: { [playlist1.id]: playlist1 },
						track: {}
					}
				},
				[]
			)
		).toEqual(playlist1.tracks![0]);

		expect(
			findPreview(
				playlist1,
				{
					deezer: {
						album: {},
						playlist: {},
						track: {}
					}
				},
				[playlist1]
			)
		).toEqual(playlist1.tracks![0]);

		expect(
			findPreview(
				track1,
				{
					deezer: {
						album: {},
						playlist: {},
						track: { [track1.id]: track1 }
					}
				},
				[]
			)
		).toEqual(track1);

		expect(
			findPreview(
				track1,
				{
					deezer: {
						album: {},
						playlist: {},
						track: {}
					}
				},
				[track1]
			)
		).toEqual(track1);
	});

	// --------------------------------------------------------------

	it("findPreview - edge", () => {
		const album1 = createFakeAlbum(0);

		expect(
			findPreview(
				{ id: "", provider: "deezer", type: "album" },
				{
					deezer: {
						album: {},
						playlist: {},
						track: {}
					}
				},
				[]
			)
		).toEqual(null);

		expect(
			findPreview(
				album1,
				{
					deezer: {
						album: { [album1.id]: album1 },
						playlist: {},
						track: {}
					}
				},
				[]
			)
		).toEqual(null);

		expect(
			findPreview(
				album1,
				{
					deezer: {
						album: {},
						playlist: {},
						track: {}
					}
				},
				[album1]
			)
		).toEqual(null);
	});

	// --------------------------------------------------------------

	it("extractTracks - valid", () => {
		const album1 = createFakeAlbum(2);
		const playlist1 = createFakePlaylist(2);
		const track1 = createFakeTrack();

		expect(
			extractTracks(
				[album1, playlist1, track1],
				{
					deezer: {
						album: { [album1.id]: album1 },
						playlist: { [playlist1.id]: playlist1 },
						track: { [track1.id]: track1 }
					}
				},
				[]
			)
		).toEqual<ContextualizedTrackAccess[]>([
			...album1.tracks!.map<ContextualizedTrackAccess>(track => ({
				contextId: album1.id,
				contextType: "album",
				id: track.id,
				provider: track.provider,
				type: track.type
			})),
			...playlist1.tracks!.map<ContextualizedTrackAccess>(track => ({
				contextId: playlist1.id,
				contextType: "playlist",
				id: track.id,
				provider: track.provider,
				type: track.type
			})),
			{
				contextId: track1.id,
				contextType: "track",
				id: track1.id,
				provider: track1.provider,
				type: track1.type
			}
		]);

		expect(
			extractTracks(
				[album1, playlist1, track1],
				{
					deezer: {
						album: {},
						playlist: {},
						track: {}
					}
				},
				[album1, playlist1, track1]
			)
		).toEqual<ContextualizedTrackAccess[]>([
			...album1.tracks!.map<ContextualizedTrackAccess>(track => ({
				contextId: album1.id,
				contextType: "album",
				id: track.id,
				provider: track.provider,
				type: track.type
			})),
			...playlist1.tracks!.map<ContextualizedTrackAccess>(track => ({
				contextId: playlist1.id,
				contextType: "playlist",
				id: track.id,
				provider: track.provider,
				type: track.type
			})),
			{
				contextId: track1.id,
				contextType: "track",
				id: track1.id,
				provider: track1.provider,
				type: track1.type
			}
		]);
	});

	// --------------------------------------------------------------

	it("extractTracks - edge", () => {
		const album1 = createFakeAlbum();

		expect(
			extractTracks(
				[],
				{
					deezer: {
						album: {},
						playlist: {},
						track: {}
					}
				},
				[]
			)
		).toEqual<ContextualizedTrackAccess[]>([]);
	});

	// --------------------------------------------------------------

	it("extractTracks - invalid", () => {
		const album1 = createFakeAlbum();

		expect(() =>
			extractTracks(
				[album1],
				{
					deezer: {
						album: {},
						playlist: {},
						track: {}
					}
				},
				[]
			)
		).toThrowError("Media is unknown");
	});

	// --------------------------------------------------------------

	it("findContextFromTrackIndex - valid", () => {
		const album1 = createFakeAlbum(2);
		const playlist1 = createFakePlaylist(2);
		const track1 = createFakeTrack();

		expect(
			findContextFromTrackIndex([album1, playlist1, track1], 3, {
				deezer: {
					album: { [album1.id]: album1 },
					playlist: { [playlist1.id]: playlist1 },
					track: { [track1.id]: track1 }
				}
			})
		).toEqual<{
			mediaFirstTrackIndex: number;
			mediaIndex: number;
			mediaSize: number;
		}>({
			mediaFirstTrackIndex: 2, // index of first track in context (playlist1)
			mediaIndex: 1, // index of playlist1
			mediaSize: playlist1.tracks!.length
		});

		expect(
			findContextFromTrackIndex([album1, playlist1, track1], 4, {
				deezer: {
					album: { [album1.id]: album1 },
					playlist: { [playlist1.id]: playlist1 },
					track: { [track1.id]: track1 }
				}
			})
		).toEqual<{
			mediaFirstTrackIndex: number;
			mediaIndex: number;
			mediaSize: number;
		}>({
			mediaFirstTrackIndex: 4, // index of first track in context (track1)
			mediaIndex: 2, // index of playlist1
			mediaSize: 1
		});
	});

	// --------------------------------------------------------------

	it("findContextFromTrackIndex - invalid", () => {
		const album1 = createFakeAlbum(2);

		expect(() =>
			findContextFromTrackIndex([album1], 0, {
				deezer: { album: {}, playlist: {}, track: {} }
			})
		).toThrowError("Media is unknown");

		expect(() =>
			findContextFromTrackIndex([album1], -1, {
				deezer: {
					album: { [album1.id]: album1 },
					playlist: {},
					track: {}
				}
			})
		).toThrowError("Track index is out of range");

		expect(() =>
			findContextFromTrackIndex([album1], album1.tracks!.length + 5, {
				deezer: {
					album: { [album1.id]: album1 },
					playlist: {},
					track: {}
				}
			})
		).toThrowError("Track index is out of range");
	});
});
