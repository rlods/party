import { createFakeAlbum, createFakePlaylist, extractAccess } from ".";
import { createQueueMerging, createQueueRemoving, RoomQueue } from "../rooms";

// ------------------------------------------------------------------

describe("Rooms Utilities", () => {
	it("createQueueMerging - valid", () => {
		const album1 = extractAccess(createFakeAlbum());
		const playlist1 = extractAccess(createFakePlaylist());

		expect(createQueueMerging([album1], [playlist1])).toEqual<RoomQueue>({
			0: album1,
			1: playlist1
		});
	});

	// --------------------------------------------------------------

	it("createQueueMerging - edge", () => {
		const album1 = extractAccess(createFakeAlbum());

		expect(createQueueMerging([], [])).toEqual<RoomQueue>({});

		expect(createQueueMerging([album1], [])).toEqual<RoomQueue>({
			0: album1
		});

		expect(createQueueMerging([], [album1])).toEqual<RoomQueue>({
			0: album1
		});
	});

	// --------------------------------------------------------------

	it("createQueueRemoving - valid", () => {
		const album1 = extractAccess(createFakeAlbum());
		const playlist1 = extractAccess(createFakePlaylist());

		expect(createQueueRemoving([album1, playlist1], 0, 0)).toEqual<
			RoomQueue
		>({
			0: album1,
			1: playlist1
		});

		expect(createQueueRemoving([album1, playlist1], 1, 1)).toEqual<
			RoomQueue
		>({
			0: album1
		});
	});

	// --------------------------------------------------------------

	it("createQueueRemoving - invalid", () => {
		const album1 = extractAccess(createFakeAlbum());

		// Testing out of range index
		expect(createQueueRemoving([album1], 2, 1)).toEqual<RoomQueue>({
			0: album1
		});
	});
});
