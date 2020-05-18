import React from "react";
//
import { CreateUserModal } from "../CreateUserModal";
import { initLocales } from "../../utils/i18n";
import { INITIAL_STATE } from "../../reducers";
import { wrapAndMount } from "../../setupTests";

// ------------------------------------------------------------------

describe("CreateUserModal", () => {
	beforeAll(async () => {
		await initLocales();
	});

	it("test not fetched", async () => {
		const onCopyToClipboard = jest.fn();
		const onModalClose = jest.fn();
		const onModalPop = jest.fn();
		const onUserCreate = jest.fn();
		const wrapper = await wrapAndMount({
			appContext: {
				onUserCreate
			},
			commonContext: {
				onCopyToClipboard,
				onModalClose,
				onModalPop
			},
			children: <CreateUserModal />,
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
		expect(onUserCreate).toHaveBeenCalledTimes(1);
	});
});
