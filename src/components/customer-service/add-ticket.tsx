import axios from "axios";
import { get } from "lodash";
import { useState } from "react"
import { useQuery } from "react-query";
import Select from './select'
import Swal from "sweetalert2";
import moment from "moment";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function AddTicket ({ ticket, conversation, handleClose, userInfo }: any) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [form, setForm] = useState(ticket || { title: '', status: 'novo', operatorResponsible: {}, companyId: '', conversationId: '', customerId: '', tasks: [] })
  const [task, setTask] = useState({ conclusionDate: new Date() })

  const { data: team, refetch } = useQuery({
    queryKey: ['team'],
    queryFn: () => getTeam(),
    refetchOnWindowFocus: false,
    enabled: !!get(userInfo, 'companiesIds[0]')
  });

  async function getTeam () {
    if (!get(userInfo, 'companiesIds[0]')) return
    const response = await axios.get('http://192.168.100.158:3003/companies/team?selectedCompanyId=' + get(userInfo, 'companiesIds[0]'), { headers: { Authorization: localStorage.getItem('token') } })
    return response.data
  }

  function onChangeInput (e: any) {
    setForm({ ...form, [e?.target?.name]: e?.target?.value})
  }

  function onChangeTaskInput (e: any) {
    setTask({ ...task, [e?.target?.name]: e?.target?.value})
  }

  async function saveTicket () {
    const data = { ...form }
    data.companyId = get(userInfo, 'companiesIds[0]')
    data.conversationId = get(conversation, '_id')
    data.customerId = get(conversation, 'customer._id')
    await axios.post('http://192.168.100.158:3003/tickets/', data, { headers: { Authorization: localStorage.getItem('token') } })
    handleClose()
  }

  async function deleteTicket () {
    Swal.fire({
      title: 'Excluir Ticket',
      text: 'Tem certeza que deseja excluir o ticket?',
      icon: 'warning',
      confirmButtonText: 'Sim',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'rgb(220, 38, 38)'
    }).then(async result => {
      if (result.isConfirmed) {
        await axios.delete('http://192.168.100.158:3003/tickets?id=' + form._id, { headers: { Authorization: localStorage.getItem('token') } })
        Swal.fire({
          title: 'Ticket excluído',
          icon: 'success',
          confirmButtonColor: 'rgb(34, 197, 94)'
        })
        handleClose()
      }
    })
  }

  function onSelectOperator (operator: any) {
    setForm({ ...form, operatorResponsible: { name: operator.name, email: operator.email } })
  }

  function onClearOperator () {
    setForm({ ...form, operatorResponsible: {} })
  }

  function onChangeStatus (e: any) {
    setForm({ ...form, status: e.target.value })
  }

  function addTask () {
    const newTasks = form.tasks
    newTasks.push(task)
    setForm({ ...form, tasks: newTasks })
    setIsAddingTask(false)
    setTask({ conclusionDate: new Date() })
  }

  async function onChangeTaskActive (index: any) {
    const isFinished = get(form, 'tasks[' + index + '].finished')
    const newTasks = form.tasks
    newTasks[index].finished = !isFinished
    setForm({ ...form, tasks: newTasks })
    const taskId = get(form, 'tasks[' + index + ']._id')
    if (taskId) {
      await axios.put('http://192.168.100.158:3003/tickets/task/', { _id: taskId, isFinished: !isFinished }, { headers: { Authorization: localStorage.getItem('token') } })
    }
  }

  function deleteTask (index: any) {
    const newTasks = form.tasks
    newTasks.splice(index, 1)
    setForm({ ...form, tasks: newTasks })
  }

  // General Ticket
  // Back office
  // Customer

  return (
    <div className="p-[18px] flex flex-col h-full">
      <div className="flex flex-row pb-[10px]">
        <div className="font-bold text-xl mx-auto">{ticket?._id ? 'Editar' : 'Criar'} Ticket</div>
        <div>
          <button type="button" onClick={handleClose} className="float-right text-3xl font-semibold bg-gray-300 leading-3 px-[10px] pt-[6px] pb-[15px] rounded-lg text-gray-700 hover:bg-gray-200">x</button>
        </div>
      </div>
      <div className="overflow-y-auto h-full flex flex-col mb-[50px]">
        <div>
          <div className="grid grid-cols-2 gap-4 border-[1px] rounded-md p-[5px] mt-[10px]">
            <div>
              <label>Título</label>
              <input value={form?.title} name="title" placeholder="Título" onChange={onChangeInput} type="text" className="p-[6px] border-gray-400 border-[1px] rounded-md w-[100%] outline-2 outline-blue-500/50"></input>
            </div>
            <div>
              <label>Status</label>
              <select value={form.status} onChange={onChangeStatus}  name="status" id="statuses" className="font-semibold p-[6px] border-gray-400 border-[1px] rounded-md w-[100%] outline-2 outline-blue-500/50">
              <option value="para_fazer" className="text-white bg-blue-400 font-semibold">Para fazer</option>
                <option value="em_progresso" className="text-white bg-green-500 font-semibold">Em progresso</option>
                <option value="resolvido" className="text-white bg-teal-400 font-semibold">Resolvido</option>
                <option value="fechado" className="text-white bg-indigo-400 font-semibold">Fechado</option>
                <option value="esperando_cliente" className="bg-red-400 text-white font-semibold">Aguardando o Cliente</option>
              </select>
            </div>
            <div>
              <label>Data de conclusão</label>
              <input value={form.conclusionDate ? (new Date(form.conclusionDate).toJSON().slice(0,10)) : ''} name="conclusionDate" onChange={onChangeInput} type="date" placeholder="Data" className="p-[6px] border-gray-400 border-[1px] rounded-md w-[100%] outline-2 outline-blue-500/50"></input>
            </div>
            <div className="col-span-2">
              <label>Operador responsável</label>
              <Select defaultSelected={ticket?.operatorResponsible} list={team} onSelect={onSelectOperator} onClear={onClearOperator}></Select>
            </div>
            <div className="col-span-2">
              <label>Descrição</label>
              <textarea value={form.description} name="description" onChange={onChangeInput} placeholder="Descrição" className="p-[6px] border-gray-400 border-[1px] rounded-md w-[100%] outline-2 outline-blue-500/50"></textarea>
            </div>
          </div>
          <p className="font-semibold mt-[10px]">Tarefas</p>
          {!!form?.tasks?.length && form.tasks.map((task: any, index: any) => (
            <div className="flex border-blue-200 border-[1px] rounded-md py-[5px] px-[5px] hover:bg-blue-100 cursor-pointer bg-blue-50 mb-[4px]">
              <input name="finished" type="checkbox" defaultChecked={task.finished} onChange={() => onChangeTaskActive(index) } />
              <p className="ml-[10px]">{task.title}</p>
              <div className="ml-auto flex">{moment(task.conclusionDate).format('LL')} <TrashIcon className="w-[20px] text-red-500 rounded-md hover:bg-red-500 hover:text-white ml-[20px]" onClick={() => deleteTask(index)} /></div>
            </div>
          ))}
          {isAddingTask && <div className="border-gray-200 border-[1px] rounded-md p-[5px] mt-[10px]">
            <label>Título</label>
            <input placeholder="Título" name="title" onChange={onChangeTaskInput} className="p-[6px] border-gray-400 border-[1px] rounded-md w-[100%] outline-2 outline-blue-500/50"></input>
            <label>Data de conclusão</label>
            <input value={task.conclusionDate ? (new Date(task.conclusionDate).toJSON().slice(0,10)) : ''} name="conclusionDate" onChange={onChangeTaskInput} type="date" placeholder="Data de conclusão" className="p-[6px] border-gray-400 border-[1px] rounded-md w-[100%] outline-2 outline-blue-500/50"></input>
            <button className="text-left rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold
            text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-blue-600 w-fit mt-[10px]" onClick={addTask}>Salvar Tarefa</button>
          </div>}
          <button onClick={() => setIsAddingTask(!isAddingTask)} className="text-blue-400 border-gray-200 border-[1px] rounded-md w-full text-left pl-[6px] bg-white hover:bg-gray-50 mt-[10px]">+ Criar tarefa</button>
          <div className="absolute right-[20px] bottom-[20px]">
            {ticket?._id && <button className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold
              text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-red-600 mr-[10px]" onClick={deleteTicket}>Deletar Ticket</button>}
            <button className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold
              text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-green-600" onClick={saveTicket}>{ticket?._id ? 'Editar' : 'Salvar'} Ticket</button>
          </div>
        </div>
      </div>
    </div>
  )
}