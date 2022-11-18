function checkIfNotificationNeeded() {
    // loop through the possible classes
    for (label_value of labels) {
        // check if this class has a notification requirement
        if (document.getElementById(label_value).value == "true") {
            notifyWaitSeconds = document.getElementById(`${label_value}_wait`).value
            // if we have detected this class
            if (label == label_value) {
                // notify if it's been happening for longer than notifyWaitSeconds
                if (priorLabel == label) {
                    if (((Math.round(new Date() / 1000)) - timeSincePriorLabel) > notifyWaitSeconds) {
                        notify(`${label_value} detected!`);
                        // reset the counter so we don't spam the user
                        timeSincePriorLabel = Math.round(new Date() / 1000);
                    }
                } else {
                    timeSincePriorLabel = Math.round(new Date() / 1000);
                }
            }
        }
    }
};

function notify(message) {
    if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notifications!");
    } else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        const notification = new Notification("Habit Breaker",
            {
                body: message,
                icon: './img/logo-512.png',
                requireInteraction: true,
                vibrate: true,
                silent: false,
            });
        notification.onclick = function () {
            window.parent.focus();
            notification.close();
        }
    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                const notification = new Notification("Habit Breaker",
                    {
                        body: message,
                        icon: 'img/logo-512.png',
                        requireInteraction: true,
                        vibrate: true,
                        silent: false,
                    });
                notification.onclick = function () {
                    window.parent.focus();
                    notification.close();
                }
            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
}