// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA

const isLocalhost = Boolean(
	window.location.hostname === "localhost" ||
		// [::1] is the IPv6 localhost address.
		window.location.hostname === "[::1]" ||
		// 127.0.0.0/8 are considered localhost for IPv4.
		window.location.hostname.match(
			/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
		)
);

export function register(config?: RegistrationOptions) {
	if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
		console.debug("PWA register 1", process.env.PUBLIC_URL);
		// The URL constructor is available in all browsers that support SW.
		const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
		if (publicUrl.origin !== window.location.origin) {
			console.debug("PWA register 2");
			// Our service worker won't work if PUBLIC_URL is on a different origin
			// from what our page is served on. This might happen if a CDN is used to
			// serve assets; see https://github.com/facebook/create-react-app/issues/2374
			return;
		}

		window.addEventListener("load", () => {
			const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
			console.debug("PWA register 3");
			if (isLocalhost) {
				console.debug("PWA register 4");
				// This is running on localhost. Let's check if a service worker still exists or not.
				checkValidServiceWorker(swUrl, config);

				// Add some additional logging to localhost, pointing developers to the
				// service worker/PWA documentation.
				navigator.serviceWorker.ready.then(() => {
					console.debug(
						"This web app is being served cache-first by a service " +
							"worker. To learn more, visit https://bit.ly/CRA-PWA"
					);
				});
			} else {
				console.debug("PWA register 5");
				// Is not localhost. Just register service worker
				registerValidSW(swUrl, config);
			}
		});
	}
}

function registerValidSW(swUrl: string, config?: RegistrationOptions) {
	console.debug("PWA registerValidSW 1");
	navigator.serviceWorker
		.register(swUrl)
		.then(registration => {
			console.debug("PWA registerValidSW 2");
			registration.onupdatefound = () => {
				console.debug("PWA registerValidSW 3");
				const installingWorker = registration.installing;
				if (installingWorker == null) {
					return;
				}
				console.debug("PWA registerValidSW 4");
				installingWorker.onstatechange = () => {
					console.debug(
						"PWA registerValidSW 5",
						installingWorker.state
					);
					if (installingWorker.state === "installed") {
						if (navigator.serviceWorker.controller) {
							console.debug("PWA registerValidSW 6");
							// At this point, the updated precached content has been fetched,
							// but the previous service worker will still serve the older
							// content until all client tabs are closed.
							console.debug(
								"New content is available and will be used when all " +
									"tabs for this page are closed. See https://bit.ly/CRA-PWA."
							);

							// Execute callback
							if (config && (config as any).onUpdate) {
								(config as any).onUpdate(registration);
							}
						} else {
							console.debug("PWA registerValidSW 7");
							// At this point, everything has been precached.
							// It's the perfect time to display a
							// "Content is cached for offline use." message.
							console.debug("Content is cached for offline use.");

							// Execute callback
							if (config && (config as any).onSuccess) {
								(config as any).onSuccess(registration);
							}
						}
					}
				};
			};
		})
		.catch(error => {
			console.error("Error during service worker registration:", error);
		});
}

function checkValidServiceWorker(swUrl: string, config?: RegistrationOptions) {
	console.debug("PWA checkValidServiceWorker 1");
	// Check if the service worker can be found. If it can't reload the page.
	fetch(swUrl, {
		headers: { "Service-Worker": "script" }
	})
		.then(response => {
			// Ensure service worker exists, and that we really are getting a JS file.
			const contentType = response.headers.get("content-type");
			console.debug(
				"PWA checkValidServiceWorker 2",
				contentType,
				response.status
			);
			if (
				response.status === 404 ||
				(contentType != null &&
					contentType.indexOf("javascript") === -1)
			) {
				// No service worker found. Probably a different app. Reload the page.
				navigator.serviceWorker.ready.then(registration => {
					registration.unregister().then(() => {
						window.location.reload();
					});
				});
			} else {
				// Service worker found. Proceed as normal.
				registerValidSW(swUrl, config);
			}
		})
		.catch(() => {
			console.debug(
				"No internet connection found. App is running in offline mode."
			);
		});
}

export function unregister() {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.ready
			.then(registration => {
				registration.unregister();
			})
			.catch(error => {
				console.error(error.message);
			});
	}
}
