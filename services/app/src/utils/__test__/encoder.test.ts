import { decode, encode } from "../encoder";

// ------------------------------------------------------------------

describe("Encoder Utilities", () => {
	it("encode/decode", async () => {
		type Foo = {
			a: number;
			b: string[];
			c: Array<{ x: number; y: number }>;
			d?: { x: number; y: number };
		};

		const foo: Foo = {
			a: 42,
			b: ["toto", "tutu"],
			c: [
				{ x: 11, y: 12 },
				{ x: 13, y: 14 }
			]
		};

		expect(decode<Foo>(encode<Foo>(foo))).toEqual(foo);
	});
});
