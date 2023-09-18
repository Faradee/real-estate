import prisma from "@/db";
import Link from "next/link";
import TodoItem from "@/components/TodoItem";
const getTodos = async () => {
  return prisma.todo.findMany();
};

const Home = async () => {
  //await prisma.todo.create({data:{title:"test",complete:false}})
  const todos = await getTodos();
  return (
    <>
      <header className="flex justify-between mb-4 items-center">
        <h1 className="text-2x1">Todos</h1>
        <Link className="button" href="/new">
          New
        </Link>
      </header>
      <ul className="pl-4">
        {todos.map((todo) => (
          <TodoItem key={todo.id} {...todo} />
        ))}
      </ul>
    </>
  );
};

export default Home;
