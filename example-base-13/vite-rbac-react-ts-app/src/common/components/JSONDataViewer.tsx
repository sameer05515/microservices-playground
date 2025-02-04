const JSONDataViewer = ({ data, space = 0 }: { data: unknown; space?: number }) => {
  //   return <pre>{JSON.stringify(data, null, 2)}</pre>;
  return (
    <pre className="whitespace-pre-wrap break-words text-blue-600 dark:text-blue-100 p-4 rounded-md shadow-sm border border-gray-300 max-w-full">
      {JSON.stringify(data, null, space)}
    </pre>
  );
};

export default JSONDataViewer;
