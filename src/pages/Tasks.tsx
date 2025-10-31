import { useEffect, useRef, useState } from 'react'
import { supabase } from "../store/supabaseClient";
import { icons } from '../store/icons'
import { handleLogout } from '../store/auth'
import { useNavigate } from 'react-router-dom'

type Task = {
  id: number
  title: string
  description: string
  completed: boolean
}

export default function Tasks(){
      const [ tasks, setTasks ] = useState<Task[]>([])
      const [ isModalOn, toggleModal] = useState(false)
      const [ loading, setLoading] = useState(true)
      const navigate = useNavigate()
      const titleRef = useRef<HTMLInputElement>(null)
      const descriptionRef = useRef<HTMLInputElement>(null)
    
    
      useEffect(() => {
        let mounted = true
        const load = async () => {
          setLoading(true)
          const { data: { session } } = await supabase.auth.getSession()
          const userId = session?.user?.id
          if (!userId) {
            navigate('/simpletodo/auth?mode=login')
            return
        }
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .order('id', { ascending: true })

        if (error) {
          console.error('Fetch tasks error', error)
        } else if (mounted) {
          setTasks(data ?? [])
          console.log(data)
        }
        setLoading(false)
      }
      load()
      }, [navigate])
    
      const openModal = () => {
        toggleModal(state => !state)
      }

      const addTask = async () => {
        const title = titleRef.current?.value?.trim() || 'No Title'
        const description = descriptionRef.current?.value?.trim() || 'No Description'
        
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          navigate('/simpletodo/auth?mode=login')
          return
        }

        const { data, error } = await supabase
          .from('todos')
          .insert([{ user_id: user.id, title, description, completed: false }])
          .select()
        
        if (error) {
          console.error('Insert task error', error)
        } else if (data && data.length) {
          setTasks(prev => [...prev, data[0]])
          if (titleRef.current) titleRef.current.value = ''
          if (descriptionRef.current) descriptionRef.current.value = ''
          openModal()
        }
      }

      const togglePending = async (id: number) => {
        const updatedTasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task)
        setTasks(updatedTasks)

        const task = updatedTasks.find(t => t.id === id)
        if (!task) return

        const { error } = await supabase
          .from('todos')
          .update({completed: task.completed})
          .eq('id', id)

        if (error) console.error('Update task error', error)
      }

      const deleteTask = async (id: number) => {
        setTasks(currentTasks => currentTasks.filter(task => task.id !== id))

        const { error } = await supabase.from('todos').delete().eq('id', id)
        if (error) {
          console.error('Deletion task error:', error)
          const { data } = await supabase.from('todos').select('*').order('id', { ascending: true })
          setTasks(data ?? [])
          // TODO: Show error message to user
          return
        }

      }

      const logout = () => {
        handleLogout();
        navigate('/simpletodo/');
      }
    
      return (
        <>
          <div className="tasks">
            {loading ? <div className="loading muted">Loading...</div> : tasks.length === 0 ? <div className='loading muted'>No tasks!</div> : tasks.map((task) => (
              <div key={task.id} className="task" onClick={() => {togglePending(task.id)}}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p className={`${task.completed ? 'completed' : 'pending'} muted`}>{task.completed ? 'Completed' : 'Pending'}</p>
                <div className="delete" onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}>{icons.delete}</div>
              </div>
            ))}
          </div>
          <div className="add"><button onClick={openModal} disabled={loading}>{icons.add}</button></div>
          <div className="logout muted" onClick={logout}>Log out</div>
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