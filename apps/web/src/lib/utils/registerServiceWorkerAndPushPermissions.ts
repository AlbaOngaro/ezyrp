function urlBase64ToUint8Array(base64String: string) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorkerAndPushPermissions() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return;
  }

  console.debug("registerServiceWorkerAndPushPermissions");

  try {
    const registration = await navigator.serviceWorker
      .register("service-worker.js")
      .catch((error) => {
        console.error("Unable to register service worker.", error);
      });

    console.log("Succesfully registered service worker");

    if (registration && navigator.permissions) {
      const result = await navigator.permissions.query({
        name: "notifications",
      });

      if (result.state === "prompt") {
        await Notification.requestPermission();
      }

      if (result.state === "granted") {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.PUSH_PUBLIC_KEY as string,
          ),
        };

        const subscription =
          await registration.pushManager.subscribe(subscribeOptions);

        console.debug("subscription", JSON.stringify(subscription));
      }
    }
  } catch (error: unknown) {}
}
