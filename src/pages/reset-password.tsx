import { CheckCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { get } from "lodash";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

// @ts-nocheck
export default function ResetPassword () {
  const queryParameters = new URLSearchParams(window.location.search)
  const token = queryParameters.get('token')

  const { data, status } = useQuery({
    queryKey: ['token-' + token],
    queryFn: () => validateToken(),
    refetchOnWindowFocus: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const [isTokenValid, setIsTokenValid] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)

  async function validateToken () {
    const response = await axios.get('http://localhost:3003/sessions/validate?token=' + token)
    setIsTokenValid(get(response, 'data.isValid'))
    return response
  }

  const onSubmit = async (data: any) => {
    const response = await axios.post('http://localhost:3003/users/reset-password/', { password: get(data, 'password'), token })
    if (get(response, 'data.success')) {
      setPasswordChanged(true)

    }
  }

  return (
    <div className="container mx-auto text-center">
      {isTokenValid && !passwordChanged && <div className="flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-bold text-center text-gray-900 leading-9">
            Insira sua nova senha
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="text-left">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 leading-5 text-left">
                  Senha
                </label>

                <div className="mt-1 rounded-md shadow-sm">
                  <input id="password" type="password" required={true} autoFocus={true} {...register("password", { validate: (password) => password.length > 7 })} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                </div>
                {errors.password && <span className="text-red-600">Crie uma senha com pelo menos 8 caracteres</span>}

              </div>

              <div className="mt-6">
                <span className="block w-full rounded-md shadow-sm">
                  <button type="submit" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                    Salvar nova senha
                  </button>
                </span>
              </div>
            </form>
            <div className="mt-5">
              <Link to="/login"><span className="text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">Eu lembrei minha senha</span></Link>
            </div>
          </div>
        </div>
      </div>}
      {data && !isTokenValid && !passwordChanged && <div className="flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mt-6 text-3xl font-bold text-center text-gray-900 leading-9">
                Este link não é válido, tente solicitar novamente a recuperação de senha
              </h2>
            </div>
            <div className="mt-6">
              <span className="block w-full rounded-md shadow-sm">
                <Link to="/forgot-password">
                  <button type="button" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                    Recuperar senha
                  </button>
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>}
      {passwordChanged && <div className="flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-bold text-center text-gray-900 leading-9">
            Senha Alterada com sucesso
          </h2>
          <div className="flex">
            <div className="mx-auto text-indigo-500">
              <CheckCircleIcon className="w-40"></CheckCircleIcon>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
            Faça login para acessar sua conta
            <div className="mt-5">
            <Link to="/login">
              <button type="button" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                Acesse sua conta
              </button>
            </Link>
            </div>
          </div>
        </div>
      </div>}
    </div>
  )
}