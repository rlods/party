import crypto from "crypto";

// ------------------------------------------------------------------

export const sign = (
	context: string,
	params: { [key: string]: string },
	secret: string
): string => {
	const hmac = crypto.createHmac("sha256", secret);
	const entries = Object.entries(params).sort((e1, e2) =>
		e1[0].localeCompare(e2[0])
	);
	hmac.update(context);
	for (const kvp of entries) {
		hmac.update(kvp[0]);
		hmac.update(kvp[1]);
	}
	return hmac.digest("hex");
};
