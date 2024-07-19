export function getCanGoToNextMonth(month: Date) {
  const today = new Date();

  return (
    today.getMonth() > month.getMonth() ||
    month.getFullYear() < today.getFullYear()
  );
}
