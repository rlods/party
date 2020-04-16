import jsonp from "jsonp";

// ------------------------------------------------------------------

export const asyncJsonp = (url: string, qs?: string): Promise<any> =>
	new Promise((resolve, reject) => {
		jsonp(
			qs
				? `${url}?${qs}&output=jsonp&callback=`
				: `${url}?output=jsonp&callback=`,
			void 0,
			(err, data) => {
				if (err) {
					reject(new Error(err.message));
				} else {
					resolve(data);
				}
			}
		);
	});
