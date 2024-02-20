importScripts('ngsw-worker.js');

self.addEventListener('fetch', event => {

    // Regular requests not related to Web Share Target.
    if (event.request.method !== "POST") {
        event.respondWith(fetch(event.request));
        return;
    }

    // Requests related to Web Share Target.
    event.respondWith(
        (async () => {
            const formData = await event.request.formData();
            const link = formData.get("link") || "";

            const msg = {
                type: "url",
                data: link
            }

            self.postMessage(msg)

        })(),
    );

});
