import { Link } from "react-router-dom"

export default function WelcomePage(){
    return (
        <div className="welcomepage">
            <p>Simple Todos</p>
            <Link to={'/simpletodo/auth?mode=signup'}>Sing up</Link>
            <Link to={'/simpletodo/auth?mode=login'} className="last-child">Log in</Link>
        </div>
    )
}