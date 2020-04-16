import { load, loadNew, search } from "../providers";
import { Media, SearchResults } from "../medias";

// ------------------------------------------------------------------

describe("Providers Utilities", () => {
	it("load - edge", async () => {
		await expect(load([])).resolves.toEqual<Media[]>([]);
	});

	// --------------------------------------------------------------

	it("loadNew - edge", async () => {
		await expect(
			loadNew([], { deezer: { album: {}, playlist: {}, track: {} } })
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
		await expect(search("", { limit: 10 })).resolves.toEqual<SearchResults>(
			{
				deezer: { album: [], playlist: [], track: [] }
			}
		);
	});
});
