import i18n from "i18next";
import { changeLanguage, initLocales } from "../i18n";

// ------------------------------------------------------------------

describe("I18N Utilities", () => {
	beforeAll(() => {
		initLocales();
	});

	it("t - valid", async () => {
		expect(i18n.t("user.user")).toEqual("User");
		changeLanguage("fr");
		expect(i18n.t("user.user")).toEqual("Utilisateur");
	});

	it("t - invalid", async () => {
		expect(i18n.t("foo.foo")).toEqual("foo.foo");
	});
});
