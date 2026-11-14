import { useState } from "react";

export default function TodoList({ todos, onToggle, onAdd, onDelete }) {
  const [text, setText] = useState("");

  function handleAdd() {
    const title = text.trim();
    if (!title) return;
    onAdd(title);
    setText("");
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-xl"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          placeholder="New task"
        />
        <button
          className="bg-blue-600 text-white rounded-lg px-4 text-xl"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>

      <ul className="text-2xl">
        {todos.map(t => (
          <li
            key={t.id}
            onClick={() => onToggle(t.id)}
            className="cursor-pointer flex justify-between"
          >
            <span>{t.done ? "✅" : "⬜"} {t.title}</span>
            <button
              className="text-red-400"
              onClick={e => {
                e.stopPropagation();
                onDelete(t.id);
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}