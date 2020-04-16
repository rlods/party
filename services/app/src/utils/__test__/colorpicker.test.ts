import { pickColor } from "../colorpicker";

// ------------------------------------------------------------------

describe("Colorpicker Utilities", () => {
	it("pickColor - valid", async () => {
		await expect(
			pickColor(
				"https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Red_flag.svg/320px-Red_flag.svg.png"
			)
		).resolves.toEqual({
			bg: { r: 221, g: 0, b: 0 },
			fg: "light"
		});
		await expect(
			pickColor(
				"https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/F1_white_flag.svg/320px-F1_white_flag.svg.png"
			)
		).resolves.toEqual({
			bg: { r: 255, g: 255, b: 255 },
			fg: "dark"
		});
	});

	// --------------------------------------------------------------

	it("pickColor - invalid (empty, bad format, etc.)", async () => {
		await expect(pickColor("")).resolves.toEqual({
			bg: { r: 255, g: 255, b: 255 },
			fg: "dark"
		});
		await expect(pickColor("invalid")).resolves.toEqual({
			bg: { r: 255, g: 255, b: 255 },
			fg: "dark"
		});
	});
});
