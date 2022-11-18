//PWA
if ("serviceWorker" in navigator) {
    // register service worker
    navigator.serviceWorker.register("/habit-breaker/service-worker.js", { scope: '/habit-breaker/' });
}
window.addEventListener('load', () => {
    registerSW();
});

// Register the Service Worker
async function registerSW() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator
                .serviceWorker
                .register('service-worker.js');
        }
        catch (e) {
            const log = console.log;
            log('SW registration failed');
        }
    }
}