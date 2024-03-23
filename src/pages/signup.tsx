import axios from "axios";
import { get, size } from "lodash";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import validator from 'email-validator'
import { useForm, SubmitHandler } from "react-hook-form"
import { useGoogleLogin } from "@react-oauth/google";

// @ts-nocheck
export default function Signup () {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('token')) {
      navigate('/dashboard')
    }
  }, [])

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    const response = await axios.post('http://192.168.100.158:3003/users/sign-up', data)
    setIsLoading(false)
    if (get(response, 'data.errorCode') === 'user-already-exists') return setUserExists(true)
    if (get(response, 'data.token')) {
      navigate('/dahboard')
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const response = await axios.post('http://192.168.100.158:3003/users/sign-up', { googleToken: tokenResponse.access_token })
      setIsLoading(false)
      if (get(response, 'data.token')) {
        localStorage.setItem('token', response.data.token)
        navigate('/dashboard')
      }
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  const [isLoading, setIsLoading] = useState(false)
  const [userExists, setUserExists] = useState(false)

  return (
    <div className="container mx-auto text-center">
      <div className="flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-bold text-center text-gray-900 leading-9">
            Cadastre-se agora
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600 leading-5 max-w">
            Ou
            <button onClick={() => googleLogin()} className="bg-white border py-2 w-full rounded-md mt-3 flex justify-center items-center text-sm duration-300 text-[#002D74] hover:border-gray-400">
              <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="25px">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Cadastre-se com o Google
            </button>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 leading-5">
                  E-mail
                </label>

                <div className="mt-1 rounded-md shadow-sm">
                  <input id="email" type="email" required={true} autoFocus={true} {...register("email", { validate: (email) => validator.validate(email) })} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                </div>
                {errors.email && <span className="text-red-600">E-mail inválido</span>}

              </div>

              <div className="mt-6 text-left">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 leading-5">
                  Senha
                </label>

                <div className="mt-1 rounded-md shadow-sm">
                  <input id="password" type="password" required={true} {...register("password", { validate: (password) => password.length > 7 })} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                </div>
                {errors.password && <span className="text-red-600">Crie uma senha com pelo menos 8 caracteres</span>}

              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="text-sm leading-5">
                  <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                    Esqueceu sua senha?
                  </Link>
                </div>
              </div>

              <div className="mt-6">
                <span className="block w-full rounded-md shadow-sm">
                  <button disabled={isLoading} type="submit" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                    {!isLoading && <span>Continuar</span>}
                    {isLoading && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>}
                  </button>
                  {userExists && <span className="text-red-600">Já existe um usuário com esse e-mail</span>}
                </span>
              </div>
            </form>
            <div className="mt-5">
              Ja tem uma conta? <Link to="/login"><span className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">Clique para entrar</span></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}