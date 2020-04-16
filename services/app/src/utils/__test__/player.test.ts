import { QUEUE_PLAYER } from "../player";

// ------------------------------------------------------------------

describe("Player Utilities", () => {
	it("play - invalid", async () => {
		await expect(QUEUE_PLAYER.play(0, "", "", 0)).rejects.toThrowError(
			"Track URL is invalid"
		);
	});
});
