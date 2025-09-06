import { useParams } from "react-router"
function TodoDetails() {
  const { id } = useParams()
  return (
    <div>
      <h1 className="text-3xl text-blue-500">hello</h1>
      <p className="text-3xl text-blue-500">{id} of particular todo</p>
    </div>
  )
}

export default TodoDetails
