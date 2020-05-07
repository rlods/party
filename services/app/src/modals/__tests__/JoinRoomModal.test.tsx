import React from "react";
//
import { JoinRoomModal } from "../JoinRoomModal";
import { initLocales } from "../../utils/i18n";
import { INITIAL_STATE } from "../../reducers";
import { createFakeContext, wrapAndMount } from "../../setupTests";

// ------------------------------------------------------------------

describe("JoinRoomModal", () => {
	beforeAll(async () => {
		await initLocales();
	});

	it("test not fetched", async () => {
		const onModalClose = jest.fn();
		const onModalPop = jest.fn();
		const onRoomEnter = jest.fn();
		const wrapper = await wrapAndMount({
			children: <JoinRoomModal />,
			context: createFakeContext({
				onModalClose,
				onModalPop,
				onRoomEnter
			}),
			state: INITIAL_STATE
		});

		const buttons = wrapper.find(".IconButton");
		const form = wrapper.find("form");
		expect(buttons.length).toEqual(4);
		for (let i = 0; i < buttons.length; ++i) {
			buttons.at(i).simulate("click");
		}
		form.simulate("submit");
		expect(onModalClose).toHaveBeenCalledTimes(2); // Close Icon + Cancel Button
		expect(onModalPop).toHaveBeenCalledTimes(1);
		expect(onRoomEnter).toHaveBeenCalledTimes(1);
	});
});
