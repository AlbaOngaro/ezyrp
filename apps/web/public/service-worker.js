self.addEventListener("push", function (event) {
  if (!self.Notification || self.Notification.permission !== "granted") {
    return;
  }

  const data = event?.data?.json() ?? {};
  const title = data.title || "Something Has Happened";
  const body = data.body || "Here's something you might want to check out.";

  self.registration.showNotification(title, {
    body,
  });
});
