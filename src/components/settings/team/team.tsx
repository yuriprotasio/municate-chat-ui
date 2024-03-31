import axios from "axios";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import validator from 'email-validator'
import { useState } from "react";
import { get, size } from "lodash";
import Modal from "../../modal/modal";
import AddUser from "./add-user";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Swal from 'sweetalert2'

// @ts-nocheck
export default function Team ({ userInfo }: any) {
  const [showModal, setShowModal] = useState(false)
  const [modalUser, setModalUser] = useState({})
  const { data: team, refetch } = useQuery({
    queryKey: ['team-' + userInfo?.companiesIds[0]],
    queryFn: () => getTeam(),
    refetchOnWindowFocus: false,
    enabled: !!get(userInfo, 'companiesIds[0]')
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  async function getTeam () {
    if (!get(userInfo, 'companiesIds[0]')) return
    return axios.get('http://192.168.100.158:3003/companies/team?selectedCompanyId=' + get(userInfo, 'companiesIds[0]'), { headers: { Authorization: localStorage.getItem('token') } })
  }

  function openModal () {
    setModalUser({})
    setShowModal(true)
  }

  function closeModal () {
    refetch()
    setShowModal(false)
  }

  async function onChangeStatus (e: any, user: any) {
    return axios.get('http://192.168.100.158:3003/companies/change-user-status?email=' + user.email + '&status=' + e.target.checked + '&companyId=' + get(userInfo, 'companiesIds[0]'), 
    { headers: { Authorization: localStorage.getItem('token') } })
  }

  function openEditModal (user: any) {
    setModalUser(user)
    setShowModal(true)
  }

  async function openDeleteConfirmation (user: any) {
    Swal.fire({
      title: 'Excluir usuário',
      text: 'Tem certeza que deseja excluir o usuário?',
      icon: 'warning',
      confirmButtonText: 'Sim',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'rgb(34, 197, 94)'
    }).then(async result => {
      if (result.isConfirmed) {
        await axios.delete('http://192.168.100.158:3003/companies/user?id=' + user?._id + '&selectedCompanyId=' + get(userInfo, 'companiesIds[0]'),
        { headers: { Authorization: localStorage.getItem('token') } })
        refetch()
        Swal.fire({
          title: 'Usuário excluído',
          icon: 'success',
          confirmButtonColor: 'rgb(34, 197, 94)'
        })
      }
    })
  }

  return (
    <div className="flex flex-col mx-[14px]">
      <div className="mt-[20px] border-gray-300 border-b-[1px]">
        <h2 className="font-bold text-xl mb-[20px]">Equipe</h2>
        <p>Aqui é onde os usuários que irão realizar as funções são cadastrados.</p>
        <button type="button" className="bg-green-500 text-white py-[10px] px-[20px] rounded-lg my-[20px]" onClick={openModal}>Cadastrar Usuário</button>
        {showModal && <Modal>
          <AddUser handleClose={closeModal} loggedUser={userInfo} user={modalUser}></AddUser>
        </Modal>}
        <hr></hr>
        <table className="w-6/12 border-separate border-spacing-y-[30px]">
          <thead>
            <tr className="text-center">
              <th className="font-semibold">Ativo</th>
              <th className="font-semibold">Foto</th>
              <th className="font-semibold">Nome</th>
              <th className="font-semibold">E-mail</th>
              <th className="font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {team?.data?.map((user: any) => (<tr className="mb-[10px] last:border-b-[0px] text-center" key={user._id}>
              <td className="">
                <label htmlFor="one">
                  <input id="one" type="checkbox" defaultChecked={user.isActive} onClick={(e) => onChangeStatus(e, user) }/>
                </label>
              </td>
              <td><img className="mx-auto w-[4rem] rounded-full bg-white h-[4rem]" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="" /></td>
              <td><span>{user.name}</span></td>
              <td><span>{user.email}</span></td>
              <td><div className="flex flex-row">
                <PencilIcon onClick={() => openEditModal(user)} className="mx-auto w-[30px] text-blue-600 bg-gray-300 p-[4px] rounded-lg hover:bg-gray-200 cursor-pointer"></PencilIcon>
                <TrashIcon onClick={() => openDeleteConfirmation(user)} className="mx-auto w-[30px] text-red-600 bg-gray-300 p-[4px] rounded-lg hover:bg-gray-200 cursor-pointer"></TrashIcon>
              </div></td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
}