import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// @ts-nocheck
export default function LandingPage () {
  const navigate = useNavigate()

  useEffect(() => {
    if(localStorage.getItem('token')) {
      navigate('/dashboard')
    }
  }, [])

  return (
    <div className="container mx-auto text-center">
      <h1>LANDING PAGE</h1>
      <Link to="/sign-up">
        <button type="button" className="bg-blue-700 text-white p-[10px] rounded-lg w-full">
          Faça seu cadastro!
        </button>
      </Link>
      <br></br><br></br>
      <Link to="/login">
        <button type="button" className="bg-blue-700 text-white p-[10px] rounded-lg w-full">
          Faça Login!
        </button>
      </Link>
    </div>
  )
}