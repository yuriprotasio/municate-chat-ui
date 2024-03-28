import axios from "axios";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import validator from 'email-validator'
import { useState } from "react";
import { get, size } from "lodash";

// @ts-nocheck
export default function Profile ({}) {
  const [isChangingEmail, setIsChangingEmail] = useState(false)
  const [isLoadingEmail, setIsLoadingEmail] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  const [invalidEmailConfirmation, setInvalidEmailConfirmation] = useState(false)
  const [invalidPasswordConfirmation, setInvalidPasswordConfirmation] = useState(false)

  const {
    register: emailRegister,
    handleSubmit: emailHandleSubmit,
    watch: emailWatch,
    reset: emailReset,
    formState: { errors: emailErrors },
  } = useForm()

  const {
    register: passwordRegister,
    handleSubmit: passwordHandleSubmit,
    watch: passwordWatch,
    reset: passwordReset,
    formState: { errors: passwordErrors },
  } = useForm()

  const { data: user, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    refetchOnWindowFocus: false
  });

  async function getProfile () {
    return axios.get('http://192.168.100.158:3003/users/info', { headers: { Authorization: localStorage.getItem('token') } })
  }

  async function onSubmitEmail (data: any) {
    setIsLoadingEmail(true)
    const response = await axios.post('http://192.168.100.158:3003/users/change-email', data, { headers: { Authorization: localStorage.getItem('token') } })
    setIsLoadingEmail(false)
    if (get(response, 'data.errorCode') === 'invalid-password') {
      setInvalidEmailConfirmation(true)
    }
    if (get(response, 'data.success')) {
      localStorage.setItem('token', get(response, 'data.token'))
      setIsChangingEmail(false)
      refetch()
    }
  }

  async function onSubmitPassword (data: any) {
    setIsLoadingPassword(true)
    const response = await axios.post('http://192.168.100.158:3003/users/change-password', data, { headers: { Authorization: localStorage.getItem('token') } })
    setIsLoadingPassword(false)
    if (get(response, 'data.errorCode') === 'invalid-password') {
      setInvalidPasswordConfirmation(true)
    }
    if (get(response, 'data.success')) {
      localStorage.setItem('token', get(response, 'data.token'))
      setIsChangingPassword(false)
      refetch()
    }
  }

  function onChangeEmail (e: any) {
    setIsChangingEmail(e.target.value !== user?.data.email)
  }

  function validatePasswordForm (form: any) {
    if (size(form.actualPassword) < 8 || size(form.newPassword) < 7 || size(form.repeatNewPassword) < 7) {
      return false
    }
    if (form.newPassword !== form.repeatNewPassword) {
      return false
    }
    return true
  }

  return (
    <div className="flex flex-col mx-[14px]">
      <div className="mt-[20px] border-gray-300 border-b-[1px]">
        <h2 className="font-bold text-xl mb-[20px]">Meu Perfil</h2>
      </div>
      {user && <div className="flex flex-col mt-[20px]">
        <div className="flex flex-row mb-[20px] items-center">
          <img className="w-[4rem] rounded-full bg-white h-[4rem]" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="" />
          <span className="ml-[10px]">
            <span className="text-xl font-semibold">{user.data.name} (você)</span><br></br>
            <span className="font-semibold">Workspace:</span> {get(user, 'data.companies[0].name', '')}<br></br>
            <span className="font-semibold">Position:</span> {get(user, 'data.companies[0].position', '')}
          </span>
        </div>
        <hr></hr>
        <form onSubmit={emailHandleSubmit(onSubmitEmail)} className="my-[20px]">
          <p className="font-semibold text-lg mb-[10px]">E-mail</p>
          Seu endereço de e-mail:<br></br>
          <input type="text" className="p-[6px] border-gray-400 border-[1px] rounded-md mb-[10px] w-[260px]" required={true} {...emailRegister("email", { value: user.data.email, onChange: (e) => onChangeEmail(e), validate: (email) => validator.validate(email) })}></input><br></br>
          {isChangingEmail && <div>
              Confirme a senha para alterar o email:<br></br>
              <input type="password" className="p-[6px] border-gray-400 border-[1px] rounded-md w-[260px]" required={true} { ...emailRegister("password", { validate: (password) => password.length > 7 })}></input>
            </div>}
          {isChangingEmail && invalidEmailConfirmation && <span className="text-red-600">Senha inválida<br></br></span>}
          {isChangingEmail && emailErrors.email && <span className="text-red-600">O e-mail informado é inválido<br></br></span>}
          {isChangingEmail && emailErrors.password && <span className="text-red-600">A senha deve conter pelo menos 8 caracteres<br></br></span>}
          {isChangingEmail && <button disabled={isLoadingEmail} type="submit" className="bg-green-500 text-white py-[10px] px-[20px] mt-[10px] rounded-md hover:bg-green-400 font-semibold">Alterar e-mail</button>}
        </form>
        <hr></hr>
        {isChangingPassword && <form onSubmit={passwordHandleSubmit(onSubmitPassword)} className="my-[20px]">
          Senha Atual:<br></br>
          <input type="password" className="p-[6px] border-gray-400 border-[1px] rounded-md mb-[10px] w-[260px]" required={true} { ...passwordRegister("actualPassword")}></input><br></br>
          Nova Senha:<br></br>
          <input type="password" className="p-[6px] border-gray-400 border-[1px] rounded-md mb-[10px] w-[260px]" required={true} { ...passwordRegister("newPassword")}></input><br></br>
          Confirme a Senha:<br></br>
          <input type="password" className="p-[6px] border-gray-400 border-[1px] rounded-md w-[260px]" required={true} { ...passwordRegister("repeatNewPassword", { validate: (password, form) => validatePasswordForm(form) }) }></input><br></br>
          {(passwordErrors.actualPassword || passwordErrors.actualPassword || passwordErrors.repeatNewPassword || invalidPasswordConfirmation) && <span className="text-red-600">Preencha os campos corretamente</span>}
          <div>
              <button type="submit" className="bg-green-500 text-white py-[10px] px-[20px] mt-[10px] rounded-md hover:bg-green-400 font-semibold">Alterar Senha</button>
              <button type="button" className="bg-gray-300 text-black py-[10px] px-[20px] mt-[10px] rounded-md hover:bg-gray-200 font-semibold ml-[20px]" onClick={() => { setIsChangingPassword(false); passwordReset() }}>Cancelar</button>
            </div>
        </form>}
        {!isChangingPassword && <div className="mt-[20px]">
          <p className="font-semibold text-lg mb-[10px]">Senha</p>
          <a onClick={() => setIsChangingPassword(true)} className="cursor-pointer text-blue-500 hover:text-blue-400">Alterar Senha</a>
        </div>} <br></br>
      </div>}
    </div>
  )
}