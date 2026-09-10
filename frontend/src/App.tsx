import { useEffect, useState } from "react";
import { APITester } from "./APITester";
import "./index.css";
import { Todos } from "./components/todo";
import Signin from "./components/Signin";
import Signup from "./components/Signup";



export function App() {
  const [todos , setTodos]= useState([]);
  const token = localStorage.getItem("token");
  const [ ShowSignup , setShowSignup ] = useState(true);

  async function fetchTodo(){
    const res= await fetch("https://api.sanskriti.xyz/todo", {
      method:"GET",
      headers:{
        authorization: localStorage.getItem("token") ?? ""
      }
    })

    const data = await res.json();

    if(!data.success){
      if(res.status === 401){
        localStorage.removeItem("token");
        window.location.reload();
      }
      return;
    }

    setTodos(data.todos)
  }

  useEffect(() => {
    if (token) {
      fetchTodo();
    }
  }, [token])

  if(! token) {
    return ShowSignup? (
      <Signup onSignup={() => setShowSignup(false)} onSwitchToSignin={() => setShowSignup(false)}/>
    ): (
        <Signin onSignin={() => setShowSignup(true)} onSwitchToSignup={() => setShowSignup(true)}/>
    )
  }

  return (
    <div>
      <Todos todos={todos} onTodoUpdated={fetchTodo}></Todos>
    </div>
  );
}

export default App;
