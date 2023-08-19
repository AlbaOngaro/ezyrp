export function Sidebar() {
  return (
    <aside className=" flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 py-4">
      <header>
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=white"
          alt="Your Company"
        />
      </header>
    </aside>
  );
}
