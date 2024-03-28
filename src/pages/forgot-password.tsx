import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import validator from 'email-validator'
import axios from "axios";
import { get } from "lodash";
import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

// @ts-nocheck
export default function ForgotPassword () {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const [requestError, setRequestError] = useState(false)
  const [requestSuccess, setRequestSuccess] = useState(false)

  const onSubmit = async (data: any) => {
    const response = await axios.post('http://192.168.100.158:3003/users/forgot-password', { email: data.email })
    if (get(response, 'data.success')) {
      console.log('success')
      setRequestSuccess(true)
    } else {
      setRequestError(true)
    }
  }

  return (
    <div className="container mx-auto text-center">
      <div className="flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-bold text-center text-gray-900 leading-9">
            {!requestSuccess && <span>Recuperação da conta</span>}
            {requestSuccess && <span>Um e-mail com as instruções para recueração de senha foi enviado</span>}
          </h2>
        </div>

        {!requestSuccess && <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 leading-5 text-left">
                  E-mail
                </label>

                <div className="mt-1 rounded-md shadow-sm">
                  <input id="email" type="email" required={true} autoFocus={true} {...register("email", { validate: (email) => validator.validate(email) })} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                </div>
                {errors.email && <span className="text-red-600">E-mail inválido</span>}

              </div>

              <div className="mt-6">
                <span className="block w-full rounded-md shadow-sm">
                  <button type="submit" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                    Recuperar senha
                  </button>
                </span>
              </div>
              {requestError && <span className="text-red-600">Ocorreu um erro, tente novamente mais tarde</span>}
            </form>
            <div className="mt-5">
              <Link to="/login"><span className="text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">Eu lembrei minha senha</span></Link>
            </div>
          </div>
        </div>}
        {requestSuccess && <div className="mx-auto text-indigo-500">
          <CheckCircleIcon className="w-40"></CheckCircleIcon>
        </div>  
        }
      </div>
    </div>
  )
}