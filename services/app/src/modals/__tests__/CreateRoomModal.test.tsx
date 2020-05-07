import React from "react";
//
import { CreateRoomModal } from "../CreateRoomModal";
import { initLocales } from "../../utils/i18n";
import { INITIAL_STATE } from "../../reducers";
import { createFakeContext, wrapAndMount } from "../../setupTests";

// ------------------------------------------------------------------

describe("CreateRoomModal", () => {
	beforeAll(async () => {
		await initLocales();
	});

	it("test not fetched", async () => {
		const onCopyToClipboard = jest.fn();
		const onModalClose = jest.fn();
		const onModalPop = jest.fn();
		const onRoomCreate = jest.fn();
		const wrapper = await wrapAndMount({
			children: <CreateRoomModal type="seabattle" />,
			context: createFakeContext({
				onCopyToClipboard,
				onModalClose,
				onModalPop,
				onRoomCreate
			}),
			state: INITIAL_STATE
		});

		const buttons = wrapper.find(".IconButton");
		const form = wrapper.find("form");
		expect(buttons.length).toEqual(5);
		for (let i = 0; i < buttons.length; ++i) {
			buttons.at(i).simulate("click");
		}
		form.simulate("submit");
		expect(onCopyToClipboard).toHaveBeenCalledTimes(1);
		expect(onModalClose).toHaveBeenCalledTimes(2); // Close Icon + Cancel Button
		expect(onModalPop).toHaveBeenCalledTimes(1);
		expect(onRoomCreate).toHaveBeenCalledTimes(1);
	});
});
