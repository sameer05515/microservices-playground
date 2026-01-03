import { useEffect, useState } from "react";

import {
    createTodo,
    deleteTodo,
    getTodos,
    updateTodo,
} from "../api/todoApi";

export default function Todos() {

    const [todos, setTodos] = useState([]);

    const [title, setTitle] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        loadTodos();

    }, []);

    const loadTodos = async () => {

        try {

            setLoading(true);

            const data = await getTodos();

            setTodos(data);

        } catch (error) {

            console.error(error);

            setError("Unable to load todos");

        } finally {

            setLoading(false);
        }
    };

    const handleCreate = async (event) => {

        event.preventDefault();

        if (!title.trim()) {
            return;
        }

        try {

            const todo = await createTodo(
                title.trim()
            );

            setTodos((previous) => [
                todo,
                ...previous,
            ]);

            setTitle("");

        } catch (error) {

            console.error(error);

            setError("Unable to create todo");
        }
    };

    const handleToggle = async (todo) => {

        try {

            const updatedTodo =
                await updateTodo(
                    todo.id,
                    todo.title,
                    !todo.completed
                );

            setTodos((previous) =>
                previous.map((item) =>
                    item.id === updatedTodo.id
                        ? updatedTodo
                        : item
                )
            );

        } catch (error) {

            console.error(error);

            setError("Unable to update todo");
        }
    };

    const handleDelete = async (id) => {

        try {

            await deleteTodo(id);

            setTodos((previous) =>
                previous.filter(
                    (todo) => todo.id !== id
                )
            );

        } catch (error) {

            console.error(error);

            setError("Unable to delete todo");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="todo-container">

            <h1>My Todos</h1>

            {error && (
                <div className="error">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleCreate}
                className="todo-form"
            >

                <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                />

                <button type="submit">
                    Add
                </button>

            </form>

            <div className="todo-list">

                {todos.length === 0 && (
                    <p>No todos yet.</p>
                )}

                {todos.map((todo) => (

                    <div
                        className="todo-item"
                        key={todo.id}
                    >

                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() =>
                                handleToggle(todo)
                            }
                        />

                        <span
                            className={
                                todo.completed
                                    ? "completed"
                                    : ""
                            }
                        >
                            {todo.title}
                        </span>

                        <button
                            // onClick={() =>
                            //     handleDelete(todo.id)
                            // }
                        >
                            Delete
                        </button>

                    </div>

                ))}

            </div>

        </div>
    );
}