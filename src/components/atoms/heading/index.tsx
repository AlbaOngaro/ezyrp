import { cn } from "lib/utils/cn";

interface Props {
  title: string;
  description?: string;
  className?: string;
}

export function Heading({ title, description, className }: Props) {
  return (
    <div className={cn("sm:flex-auto", className)}>
      <h1 className="text-base font-semibold leading-6 text-gray-900">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-sm text-gray-700">{description}</p>
      )}
    </div>
  );
}
