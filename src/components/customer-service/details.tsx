// @ts-nocheck

import { useEffect, useState } from "react"
import AddNegotiation from "./add-negotiation"
import AddTicket from "./add-ticket"
import Modal from "../modal/modal"
import { get } from "lodash"
import { useQuery } from "react-query"
import axios from "axios"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import moment from "moment"
import { formatValue } from 'react-currency-input-field';
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"

export default function Details ({ conversation, userInfo }) {
  const [showModal, setShowModal] = useState(false)
  const [modalActive, setModalActive] = useState('')
  const [selectedNegotiation, setSelectedNegotiation] = useState()
  const [selectedTicket, setSelectedTicket] = useState()

  const companyId = get(userInfo, 'companiesIds[0]')
  const conversationId = get(conversation, '_id')

  const { data: negotiations, refetch, isLoading: isLoadingNegotiations } = useQuery({
    queryKey: ['negotiations-' + companyId + '-' + conversationId],
    queryFn: () => getNegotiations(),
    refetchOnWindowFocus: true,
  });

  const { data: tickets, refetch: refetchTickets, isLoading: isLoadingTickets } = useQuery({
    queryKey: ['tickets-' + companyId + '-' + conversationId],
    queryFn: () => getTickets(),
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    refetch()
    refetchTickets()
  }, [conversationId])

  async function getNegotiations() {
    const response = await axios.get('http://192.168.100.158:3003/negotiations?conversationId=' + conversationId + '&companyId=' + companyId, {
      headers: { Authorization: localStorage.getItem('token') }
    })
    return response
  }

  async function getTickets() {
    const response = await axios.get('http://192.168.100.158:3003/tickets?conversationId=' + conversationId + '&companyId=' + companyId, {
      headers: { Authorization: localStorage.getItem('token') }
    })
    return response
  }

  function openModal(type) {
    setModalActive(type)
    setShowModal(!showModal)
  }

  function closeModal () {
    refetch()
    refetchTickets()
    setSelectedNegotiation({})
    setShowModal(false)
  }

  function collapseContent (negotiation) {
    const chevronIcon = document.getElementById('chevron-' + negotiation._id)
    const contentDiv = document.getElementById('content-' + negotiation._id)
    contentDiv?.classList.toggle('active')
    chevronIcon?.classList.toggle('rotate-180')
  }

  function onEditNegotiation (negotiation) {
    setSelectedNegotiation(negotiation)
    openModal('NEGOTIATION')
  }

  function onEditTicket (ticket) {
    setSelectedTicket(ticket)
    openModal('TICKET')
  }

  async function onChangeNegotiationTaskActive (task) {
    await axios.put('http://192.168.100.158:3003/negotiations/task/', { _id: task._id, isFinished: !task.finished }, { headers: { Authorization: localStorage.getItem('token') } })
  }

  async function onChangeTicketTaskActive (task) {
    await axios.put('http://192.168.100.158:3003/tickets/task/', { _id: task._id, isFinished: !task.finished }, { headers: { Authorization: localStorage.getItem('token') } })
  }

  async function deleteNegotiationTask (task) {
    await axios.delete('http://192.168.100.158:3003/negotiations/task?id=' + task._id, { headers: { Authorization: localStorage.getItem('token') } })
    refetch()
  }

  async function deleteTicketTask (task) {
    await axios.delete('http://192.168.100.158:3003/tickets/task?id=' + task._id, { headers: { Authorization: localStorage.getItem('token') } })
    refetchTickets()
  }

  return (
    <div className="w-3/12 border-gray-200 border-l bg-gray-50 py-[20px] px-[20px]">
    {!isLoadingNegotiations && !isLoadingTickets && 
      <div>
        <h2 className="font-bold pb-[20px]">Informações</h2>
        {!!negotiations?.data?.length && <h2 className="font-semibold">Negociações</h2>}
        {!!negotiations?.data?.length && negotiations.data.map(negotiation => (
          <div>
            <div className="bg-white px-[5px] py-[5px] border-blue-200 border-[1px] rounded-md hover:bg-gray-50 cursor-pointer">
              <div className="flex">
                <div className="flex w-full" onClick={() => collapseContent(negotiation)}>
                  {negotiation.title}
                  <span className="font-bold">
                    <ChevronDownIcon id={'chevron-'+ negotiation._id} className="w-[25px]" />
                  </span>
                </div>
                <PencilSquareIcon className="ml-auto cursor-pointer hover:bg-blue-200 rounded-md w-[25px]" onClick={() => onEditNegotiation(negotiation)}/> 
              </div>
            </div>
            <div id={'content-' + negotiation._id} className="content bg-white rounded-md p-[5px] border-blue-200 border-[1px]">
              <div className="flex flex-col">
                <div>
                  <div className="grid grid-cols-2 gap-4 p-[5px]">
                    <div>
                      <label className="font-semibold">Título</label><br></br>
                      {negotiation.title}
                    </div>
                    <div>
                      <label className="font-semibold">Status</label><br></br>
                      {negotiation.status}
                    </div>
                    <div>
                      <label className="font-semibold">Data de conclusão</label><br></br>
                      {moment(negotiation.conclusionDate).format('LL')}
                    </div>
                    <div>
                      <label className="font-semibold">Valor</label><br></br>
                      {formatValue({ value: negotiation?.value?.toString(), groupSeparator: '.', decimalSeparator: ',', decimalScale: 2 })}
                    </div>
                    <div className="col-span-2">
                      <label className="font-semibold">Operador responsável</label><br></br>
                      {negotiation.operatorResponsible.email}
                    </div>
                    <div className="col-span-2">
                      <label className="font-semibold">Descrição</label><br></br>
                      <span className="whitespace-pre-line">{negotiation.description}</span>
                    </div>
                  </div>
                  {negotiation?.tasks?.map(task => (
                    <div className="flex border-blue-200 border-[1px] rounded-md py-[5px] px-[5px] hover:bg-blue-100 cursor-pointer bg-blue-50 mb-[4px]">
                      <input name="finished" type="checkbox" defaultChecked={task.finished} onChange={() => onChangeNegotiationTaskActive(task) } />
                      <p className="ml-[10px]">{task.title}</p>
                      <div className="ml-auto flex">{moment(task.conclusionDate).format('LL')} <TrashIcon className="w-[20px] text-red-500 rounded-md hover:bg-red-500 hover:text-white ml-[20px]" onClick={() => deleteNegotiationTask(task)} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="mb-[10px] mt-[20px]">
          <button onClick={() => openModal('NEGOTIATION')} className="text-blue-400 border-gray-200 border-[1px] rounded-sm w-full text-left pl-[6px] bg-white hover:bg-gray-50">+ Criar negociação</button>
        </div>

        {!!tickets?.data?.length && <h2 className="font-semibold">Tickets</h2>}
        {!!tickets?.data?.length && tickets.data.map(ticket => (
          <div>
            <div className="bg-white px-[5px] py-[5px] border-blue-200 border-[1px] rounded-md hover:bg-gray-50 cursor-pointer">
              <div className="flex">
                <div className="flex w-full" onClick={() => collapseContent(ticket)}>
                  {ticket.title}
                  <span className="font-bold">
                    <ChevronDownIcon id={'chevron-'+ ticket._id} className="w-[25px]" />
                  </span>
                </div>
                <PencilSquareIcon className="ml-auto cursor-pointer hover:bg-blue-200 rounded-md w-[25px]" onClick={() => onEditTicket(ticket)}/> 
              </div>
            </div>
            <div id={'content-' + ticket._id} className="content bg-white rounded-md p-[5px] border-blue-200 border-[1px]">
              <div className="flex flex-col">
                <div>
                  <div className="grid grid-cols-2 gap-4 p-[5px]">
                    <div>
                      <label className="font-semibold">Título</label><br></br>
                      {ticket.title}
                    </div>
                    <div>
                      <label className="font-semibold">Status</label><br></br>
                      {ticket.status}
                    </div>
                    <div>
                      <label className="font-semibold">Data de conclusão</label><br></br>
                      {moment(ticket.conclusionDate).format('LL')}
                    </div>
                    <div className="col-span-2">
                      <label className="font-semibold">Operador responsável</label><br></br>
                      {ticket.operatorResponsible.email}
                    </div>
                    <div className="col-span-2">
                      <label className="font-semibold">Descrição</label><br></br>
                      <span className="whitespace-pre-line">{ticket.description}</span>
                    </div>
                  </div>
                  {ticket?.tasks?.map(task => (
                    <div className="flex border-blue-200 border-[1px] rounded-md py-[5px] px-[5px] hover:bg-blue-100 cursor-pointer bg-blue-50 mb-[4px]">
                      <input name="finished" type="checkbox" defaultChecked={task.finished} onChange={() => onChangeTicketTaskActive(task) } />
                      <p className="ml-[10px]">{task.title}</p>
                      <div className="ml-auto flex">{moment(task.conclusionDate).format('LL')} <TrashIcon className="w-[20px] text-red-500 rounded-md hover:bg-red-500 hover:text-white ml-[20px]" onClick={() => deleteTicketTask(task)} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-[20px]">
          <button onClick={() => openModal('TICKET')} className="text-blue-400 border-gray-200 border-[1px] rounded-sm w-full text-left pl-[6px] bg-white hover:bg-gray-50">+ Criar ticket</button>
        </div>

        {showModal && <Modal>
          {modalActive === 'NEGOTIATION' && <AddNegotiation negotiation={selectedNegotiation} conversation={conversation} handleClose={closeModal} userInfo={userInfo} />}
          {modalActive === 'TICKET' && <AddTicket ticket={selectedTicket} conversation={conversation} handleClose={closeModal} userInfo={userInfo} />}
        </Modal>}
      </div>
    }
    </div>
  )
}