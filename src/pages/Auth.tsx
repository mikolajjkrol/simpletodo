import { useState } from "react"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import { handleLogin, handleSignUp } from "../store/auth";

export default function Auth() {
    const [ searchParams ] = useSearchParams()
    const [ password, setPassword ] = useState('');
    const [ email, setEmail ] = useState('');
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    
    const navigate = useNavigate();

    const mode = searchParams.get('mode')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (mode === 'login') {
                const response = await handleLogin(email, password)
                if (response.error) {
                    setError(response.error.message)
                } else if (response.data.session) {
                    navigate('/simpletodo/tasks')
                }
            } else {
                await handleSignUp(email, password)
                setError('Please check your email for the confirmation link')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (    
            <form onSubmit={handleSubmit} className="welcomepage">
                <p>{mode === 'login' ? 'Log in' : 'Sign up'}</p>
                <input 
                    type="email" 
                    placeholder="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required 
                    disabled={loading}
                />
                <input 
                    type="password" 
                    placeholder="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                />
                <button 
                    type="submit" 
                    className="last-child"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : mode === 'login' ? 'Log in' : 'Sign up'}
                </button>
                {error && <p style={{color: 'red', fontSize: '0.9rem'}}>{error}</p>}
                <Link 
                    to={mode === 'login' ? '/simpletodo/auth?mode=signup' : '/simpletodo/auth?mode=login'} 
                    className="diff">
                    {mode === 'signup' ? 'Have an account? Log in!' : "Don't have an account? Sign up!"}
                </Link>
            </form>
            

    )
}