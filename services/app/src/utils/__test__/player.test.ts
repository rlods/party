import { QUEUE_PLAYER } from "../player";

// ------------------------------------------------------------------

describe("Player Utilities", () => {
	/*
	it("play - valid", async () => {
		import { mocked } from "ts-jest/utils";
		import { createSourceNode, decodeAudioData } from "../audio";
		jest.mock("../audio");

		await expect(
			QUEUE_PLAYER.play(
				0,
				"",
				"https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-5.mp3",
				0
			)
		).resolves.toReturn();
	});
	*/

	it("play - invalid", async () => {
		await expect(QUEUE_PLAYER.play(0, "", "", 0)).rejects.toThrowError(
			"Invalid URL"
		);
	});
});
