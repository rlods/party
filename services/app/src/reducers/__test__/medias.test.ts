import { initStore } from "../../utils/redux";
import { setMedias } from "../../reducers/medias";
import { StructuredMedias } from "../../utils/medias";
import {
	createFakeAlbum,
	createFakePlaylist,
	createFakeTrack
} from "../../utils/__test__";

// ------------------------------------------------------------------

describe("Medias Reducer", () => {
	it("setMedias - valid", async () => {
		const { dispatch, getState } = initStore();

		const album1 = createFakeAlbum();
		const playlist1 = createFakePlaylist();
		const track1 = createFakeTrack();

		expect(getState().medias.data).toEqual<StructuredMedias>({
			deezer: {
				album: {},
				playlist: {},
				track: {}
			},
			spotify: {
				album: {},
				playlist: {},
				track: {}
			}
		});

		dispatch(setMedias([album1, playlist1, track1]));

		expect(getState().medias.data).toEqual<StructuredMedias>({
			deezer: {
				album: { [album1.id]: album1 },
				playlist: { [playlist1.id]: playlist1 },
				track: { [track1.id]: track1 }
			},
			spotify: {
				album: {},
				playlist: {},
				track: {}
			}
		});
	});
});
