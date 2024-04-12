import { useForm } from "react-hook-form"
import validator from 'email-validator'
import axios from "axios"
import { useState } from "react"

export default function AddUser ({ handleClose, loggedUser, user }: any) {
  const [isAdding, setIsAdding] = useState(false)
  const [somethingWentWrong, setSomethingWentWrong] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  async function onSubmit (data: any) {
    if (isAdding) return
    setIsAdding(true)
    let response
    if (!user?._id) {
      response = await addUser(data)
    } else {
      response = await updateUser(data)
    }
    if (response?.data?.success) {
      reset()
      handleClose()
    }
    setIsAdding(false)
  }

  async function addUser (data: any) {
    return axios.post('http://192.168.100.158:3003/companies/user', {
      ...data,
      selectedCompanyId: loggedUser.companiesIds[0]
    }, { headers: { Authorization: localStorage.getItem('token') } }).catch(e => {
      setSomethingWentWrong(true)
    })
  }

  async function updateUser (data: any) {
    return axios.put('http://192.168.100.158:3003/companies/user', {
      ...data,
      _id: user?._id,
      selectedCompanyId: loggedUser.companiesIds[0]
    }, { headers: { Authorization: localStorage.getItem('token') } }).catch(e => {
      setSomethingWentWrong(true)
    })
  }

  return (
    <div className="p-[18px]">
      <div className="flex flex-row">
        <div className="font-bold text-xl mx-auto">{user?._id ? 'Editar' : 'Cadastrar'} usuário</div>
        <div>
          <button type="button" onClick={handleClose} className="float-right text-3xl font-semibold bg-gray-300 leading-3 px-[10px] pt-[6px] pb-[15px] rounded-lg text-gray-700 hover:bg-gray-200">x</button>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-[20px] flex flex-col mx-[20%]">
        <span>Nome</span>
        <input type="text" className="p-[6px] border-gray-400 border-[1px] rounded-md w-[100%] outline-2 outline-blue-500/50" required={true} {...register("name", { validate: (name) => name.length > 1, value: user?.name })}></input>
        {errors.name && <span className="text-red-600">Insira um nome válido</span>}
        <span>E-mail</span>
        <input type="text" className="p-[6px] border-gray-400 border-[1px] rounded-md mb-[10px] w-[100%] outline-2 outline-blue-500/50" required={true} {...register("email", { validate: (email) => validator.validate(email), value: user?.email })}></input>
        {errors.email && <span className="text-red-600">Insira um e-mail válido</span>}
        <span>Cargo (Opcional)</span>
        <input type="text" className="p-[6px] border-gray-400 border-[1px] rounded-md mb-[10px] w-[100%] outline-2 outline-blue-500/50" {...register("position", { value: user?.position })}></input>
        <span>Telefone (Opcional)</span>
        <input type="text" className="p-[6px] border-gray-400 border-[1px] rounded-md mb-[10px] w-[100%] outline-2 outline-blue-500/50" {...register("phoneNumber", { value: user?.phoneNumber })}></input>
        <p>O usuário precisa ter uma conta ativa em municate para poder acessar sua área de trabalho.</p>
        {somethingWentWrong && <span className="text-red-600">Ocorreu um erro, tente novamente mais tarde.</span>}
        <div className="mt-6 flex items-center gap-x-6">
          <button type="submit" className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold
          text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-green-600 outline-2 outline-blue-500/50">
            {user?._id ? 'Editar' : 'Cadastrar'} Usuário
          </button>
        </div>
      </form>
    </div>
  )  
}