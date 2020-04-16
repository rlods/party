import i18n from "i18next";
import { changeLanguage, initLocales } from "../i18n";

// ------------------------------------------------------------------

describe("I18n Utilities", () => {
	beforeAll(() => {
		initLocales();
	});

	it("t - valid", async () => {
		expect(i18n.t("users.user")).toEqual("User");
		changeLanguage("fr");
		expect(i18n.t("users.user")).toEqual("Utilisateur");
	});

	it("t - invalid", async () => {
		expect(i18n.t("foo.foo")).toEqual("foo.foo");
	});
});
