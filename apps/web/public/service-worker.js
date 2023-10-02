self.addEventListener("push", function (event) {
  if (!self.Notification || self.Notification.permission !== "granted") {
    return;
  }

  const data = event?.data?.json() ?? {};
  const { title, ...rest } = data;

  self.registration.showNotification(title, rest);
});
