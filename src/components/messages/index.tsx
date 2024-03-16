// @ts-nocheck
import { ChevronRightIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Chat from '../chat'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import * as moment from 'moment'

export default function Messages ({ chatOpened, setChatOpened, municateOpened, setMunicateOpened }) {
  const [chats, setChats] = useState([])
  const [chatSelected, setChatSelected] = useState({})
  function onChatClick (chat) {
    setChatOpened(true)
    setChatSelected(chat)
  }

  const { data, status } = useQuery({
    queryKey: ['chats'],
    queryFn: getChats,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setChats(data?.data)
  }, [data]);

  function getChats () {
    return axios.post('http://192.168.100.158:3003/chat/get-chats', {
      "customerId": "65edd7ba8ce11c75045c05d1"
    })
  }

  return (
    <div>
      {chatOpened && <Chat setChatOpened={setChatOpened} chatSelected={chatSelected} municateOpened={municateOpened} setMunicateOpened={setMunicateOpened} />}
      {!chatOpened && <div className="flex flex-col grow">
        <main className="overflow-auto flex flex-col sm:h-[468px] grow">
          {chats?.length && chats.map(chat => (
            <div onClick={() => onChatClick(chat)} className="flex hover:bg-blue-100 cursor-pointer h-[70px] p-[10px] border-b-[1px] border-gray-300 last:border-b-[0px]">
              <UserCircleIcon className="w-2/12"></UserCircleIcon>
              <div className="w-9/12">
                <div className="truncate">{chat.messages[0].message}</div>
                {chat.employee.name.split(' ').slice(0, -1).join(' ')} • {moment(chat.messages[0].date).startOf('hour').fromNow()}
              </div>
              <ChevronRightIcon className="w-1/12  p-[6px]"></ChevronRightIcon>
            </div>
          ))}
        </main>
      </div>}
    </div>
  )
}