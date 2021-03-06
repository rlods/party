import { loadMedias, loadNewMedias, searchMedias, SearchResults } from "../";
import { Media } from "../../medias";

// ------------------------------------------------------------------

describe("Providers Utilities", () => {
	it("load - edge", async () => {
		await expect(loadMedias([])).resolves.toEqual<Media[]>([]);
	});

	// --------------------------------------------------------------

	it("loadNewMedias - edge", async () => {
		await expect(
			loadNewMedias([], {
				deezer: { album: {}, playlist: {}, track: {} },
				spotify: { album: {}, playlist: {}, track: {} }
			})
		).resolves.toEqual<Media[]>([]);
	});

	// --------------------------------------------------------------

	it("search - edge", async () => {
		await expect(
			searchMedias("", { limit: 10, offset: 0 })
		).resolves.toEqual<SearchResults>({
			deezer: { album: [], playlist: [], track: [] },
			spotify: { album: [], playlist: [], track: [] }
		});
	});
});
