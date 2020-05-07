import React from "react";
//
import { ConnectUserModal } from "../ConnectUserModal";
import { initLocales } from "../../utils/i18n";
import { INITIAL_STATE } from "../../reducers";
import { createFakeContext, wrapAndMount } from "../../setupTests";

// ------------------------------------------------------------------

describe("ConnectUserModal", () => {
	beforeAll(async () => {
		await initLocales();
	});

	it("test not fetched", async () => {
		const onModalClose = jest.fn();
		const onModalPop = jest.fn();
		const onUserConnect = jest.fn();
		const wrapper = await wrapAndMount({
			children: <ConnectUserModal />,
			context: createFakeContext({
				onModalClose,
				onModalPop,
				onUserConnect
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
		expect(onUserConnect).toHaveBeenCalledTimes(1);
	});
});
