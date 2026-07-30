export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-20 text-center">
      <p className="text-sm text-red-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-full bg-indigo px-5 py-2 text-sm font-medium text-ivory hover:bg-indigo-light"
        >
          Try again
        </button>
      )}
    </div>
  );
}
