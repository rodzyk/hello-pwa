self.addEventListener('fetch', event => {
    const { method } = event.request.method
    
    // Regular requests not related to Web Share Target.
    if (method !== "POST") {
        // event.respondWith(fetch(event.request));
        return Response.redirect('/', 303);
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
            return Response.redirect('/', 303);
        })(),
    );

});

importScripts('ngsw-worker.js');