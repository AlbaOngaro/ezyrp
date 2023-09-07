interface Props {
  title: string;
  description?: string;
}

export function Heading({ title, description }: Props) {
  return (
    <div className="sm:flex-auto">
      <h1 className="text-base font-semibold leading-6 text-gray-900">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-sm text-gray-700">{description}</p>
      )}
    </div>
  );
}
