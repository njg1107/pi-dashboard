from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

DB_PATH = "dashboard.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # lets you access columns by name
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            done INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_db()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


mock_weather = {"temp": 70, "condition": "Sunny", "fetched_at": "2026-10-19T14:00:00Z"}

@app.get("/api/weather")
def get_weather():
    return mock_weather

class TodoCreate(BaseModel):
    title: str

@app.get("/api/todos")
def get_todos():
    conn = get_db()
    rows = conn.execute("SELECT id, title, done FROM tasks").fetchall()
    conn.close()
    return [{"id": r["id"], "title": r["title"], "done": bool(r["done"])}
        for r in rows
    ]

@app.post("/api/todos")
def create_todo(todo: TodoCreate):
    conn = get_db()
    cur = conn.execute("INSERT INTO tasks (title) VALUES (?)", (todo.title,))
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return {"id": new_id, "title": todo.title, "done": False}

@app.patch("/api/todos/{todo_id}")
def toggle_todo(todo_id: int):
    conn = get_db()
    conn.execute("UPDATE tasks SET done = 1 - done WHERE id = ?", (todo_id,))
    conn.commit()
    row = conn.execute(
        "SELECT id, title, done FROM tasks WHERE id = ?", (todo_id,)
    ).fetchone()
    conn.close()
    if row is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"id": row["id"], "title": row["title"], "done": bool(row["done"])}

@app.delete("/api/todos/{todo_id}")
def delete_todo(todo_id: int):
    conn = get_db()
    cur = conn.execute("DELETE FROM tasks WHERE id = ?", (todo_id,))
    conn.commit()
    conn.close()
    if cur.rowcount == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"deleted": todo_id}