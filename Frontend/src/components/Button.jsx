export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="bg-indigo-600 text-white py-2 px-2 rounded-lg hover:bg-indigo-700 transition"
    >
      {children}
    </button>
  );
}
