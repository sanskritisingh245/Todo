import  { useState } from "react";

export function Todos({todos,onTodoUpdated}){
    const [title, setTitle] = useState("");
    const [description, setDescription] =useState("");

    async function addTodo() {
       const res= await fetch("http://localhost:3000/todo", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                authorization: localStorage.getItem("token") ?? ""
            }, 
            body:JSON.stringify({
                title,
                description
            }),  
        }); 

        onTodoUpdated();
    }

    async function deleteTodo(todoId) {
        await fetch(`http://localhost:3000/todo/${todoId}`, {
            method: "DELETE",
            headers:{
                "Content-Type":"application/json",
                authorization: localStorage.getItem("token") ?? "",
            },
        })
        onTodoUpdated();
    }


    async function markCompleted(todo){
        await fetch(`http://localhost:3000/todo/${todo.id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                authorization: localStorage.getItem("token") ?? ""
            },
            body:JSON.stringify({
                title: todo.title,
                description: todo.description,
                Status: "COMPLETED",
            }),
        });
        onTodoUpdated();
    }

    return (
        <div>
            <div>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.reload();
                    }}
                >
                    Logout
                </button>
            </div>
            <input
                type="text"
                value={title}
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
            >
            </input>

            <input
                type="text"
                value={description}
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
            >
            </input>

            {todos.map(todo => (
                todo.status !== "DELETED" && (
                    <div key={todo.id}>
                        <h5>{todo.title}</h5>
                        <h6>{todo.description}</h6>
                        <button
                            disabled={todo.status === "COMPLETED"}
                            onClick={()=>markCompleted(todo)}
                        >
                            {todo.status === "COMPLETED" ? "completed":"Mark as completed"}

                        </button>
                        <button onClick={() => deleteTodo(todo.id)}>
                            Delete
                        </button>
                    </div>

                )
            ))}
            <button
                onClick={addTodo}
            >
                Add Todo
            </button>

        </div>
    )
}