import { useEffect, useRef, useState } from 'react'
import { tasks as importedTasks} from './store/tasks'
import { icons } from './store/icons'

type Task = {
  id: number
  title: string
  description: string
  completed: boolean
}

function App() {
  const [ tasks, setTasks ] = useState<Task[]>([])
  const [ isModalOn, toggleModal] = useState(false)

  const titleRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)


  useEffect(() => {
    setTasks(importedTasks)
  }, [])

  const openModal = () => {
    toggleModal(state => !state)
  }

  const togglePending = (id: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed }
      }
      return task
    })
    setTasks(updatedTasks)
  }

  const addTask = () => {
    const newTask: Task = {
      id: tasks.length + 1,
      title: titleRef.current?.value || 'No Title',
      description: descriptionRef.current?.value || 'No Description',
      completed: false,
    }
    setTasks([...tasks, newTask])
    if (titleRef.current) titleRef.current.value = ''
    if (descriptionRef.current) descriptionRef.current.value = ''
    
    openModal()
  }

  return (
    <>
      <div className="tasks">
        {tasks.map((task) => (
          <div key={task.id} className="task" onClick={() => {togglePending(task.id)}}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p className={`${task.completed ? 'completed' : 'pending'} muted`}>{task.completed ? 'Completed' : 'Pending'}</p>
            
          </div>
        ))}
      </div>
      <div className="add"><button onClick={openModal}>{icons.add}</button></div>
      {isModalOn && (
        <div className="modal">
          <div className="modal-content">
            <input type="text" placeholder='title' ref={titleRef}/>
            <input type="text" placeholder='description' ref={descriptionRef}/>
            <div className='buttons'>
              <button onClick={addTask}>{icons.add}</button>
              <button onClick={openModal}>{icons.undo}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
