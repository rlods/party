import {
	loadMedias,
	loadNewMedias,
	searchMedias,
	SearchResults
} from "../providers";
import { Media } from "../medias";

// ------------------------------------------------------------------

describe("Providers Utilities", () => {
	it("load - edge", async () => {
		await expect(loadMedias([])).resolves.toEqual<Media[]>([]);
	});

	// --------------------------------------------------------------

	it("loadNewMedias - edge", async () => {
		await expect(
			loadNewMedias([], {
				deezer: { album: {}, playlist: {}, track: {} }
			})
		).resolves.toEqual<{
			newMedias: Media[];
			newMediasAndTracks: Media[];
		}>({
			newMedias: [],
			newMediasAndTracks: []
		});
	});

	// --------------------------------------------------------------

	it("search - edge", async () => {
		await expect(searchMedias("", { limit: 10 })).resolves.toEqual<
			SearchResults
		>({
			deezer: { album: [], playlist: [], track: [] }
		});
	});
});
