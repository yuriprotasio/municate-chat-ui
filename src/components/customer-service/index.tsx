import axios from "axios";
import { get } from "lodash";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import moment from 'moment'
import { useState } from "react";
import Details from "./details";
import Chat from "./chat";

// @ts-nocheck
export default function CustomerService ({ company }: any) {
  const [chatOpened, setChatOpened] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState(false)
  const navigate = useNavigate()
  const selectedCompanyId = ''
  const { data, status, isLoading } = useQuery({
    queryKey: ['Dashboard-' + selectedCompanyId],
    queryFn: () => getConversations(),
    refetchOnWindowFocus: false,
  });

  async function getConversations() {
    const response = await axios.post('http://192.168.100.158:3003/chat/company/get-chats', { companyId: selectedCompanyId }, {
      headers: { Authorization: localStorage.getItem('token') }
    })
    if (get(response, 'data') === 'Not Authorized') {
      navigate('/login')
      localStorage.clear()
    }
    return response
  }

  function onConversationClick (conversation: any) {
    setChatOpened(true)
    setSelectedConversation(conversation)
  }

  return (
    <div className="flex flex-col">
      <div>
        <div className="flex">
          <div className={`${!chatOpened ? 'w-full' : 'w-3/12'} overflow-auto`}>
            <h2 className="text-left text-xl font-bold ml-[15px] mt-[20px]">Atendimento</h2>
            <div className="flex border-b-[2px] border-gray-300 pb-4 py-4 z-10 bg-gray-50">
              <span className="ml-[15px] bg-gray-300 rounded-lg py-[5px] px-[10px] cursor-pointer font-semibold hover:bg-gray-200">Conversas</span>
            </div>
            {get(data, 'data', []).map((conversation: any) => (
              <div key={conversation._id} onClick={() => onConversationClick(conversation)} className="flex flex-col border-gray-300 border-b-[1px] hover:bg-blue-100 border-gray-300 last:border-b-[0px]">
                <div onClick={() => onConversationClick(conversation)} className={`${!chatOpened ? 'w-4/12' : 'w-full'} flex cursor-pointer p-[10px]`}>
                  <div className="w-1/12 me-[10px]">
                    <div className="rounded-full p-[2px] w-[36px] h-[36px] bg-white mt-[6px]">
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
                        <path fill="#2196F3" d="M45,34V18c0-4.418-3.582-8-8-8H16c-4.418,0-8,3.582-8,8v16H45z"></path><path fill="#FF3D00" d="M38 17H42V23H38z"></path><path fill="#FF3D00" d="M30 17H40V19H30z"></path><path fill="#FF3D00" d="M29 16A2 2 0 1 0 29 20A2 2 0 1 0 29 16Z"></path><path fill="#DD2C00" d="M29 17A1 1 0 1 0 29 19A1 1 0 1 0 29 17Z"></path><path fill="#FFCC80" d="M25 34H30V44H25z"></path><path fill="#FFA726" d="M25 34H30V36H25z"></path><path fill="#1976D2" d="M16,10c-4.411,0-8,3.589-8,8v14v2h2h12h2v-2V18C24,13.589,20.411,10,16,10L16,10z"></path><path fill="#64B5F6" d="M16,12c-3.309,0-6,2.691-6,6v14h12V18C22,14.691,19.309,12,16,12z"></path><path fill="#0D47A1" d="M20,20c0,0.552-0.448,1-1,1h-6c-0.552,0-1-0.448-1-1l0,0c0-0.552,0.448-1,1-1h6C19.552,19,20,19.448,20,20L20,20z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="w-11/12 text-left text-gray-700 me-[10px]">
                    <span>{conversation?.customer?.name || 'Novo Cliente'}</span>
                    <div className="">
                      <div className="flex font-bold">
                        <div className="w-10/12 truncate">
                          {conversation.messages[0].message}
                        </div>
                        <span className="w-2/12 text-xs text-right float-right">
                          {moment(conversation.messages[0].date).fromNow()}
                        </span>
                      </div>
                    </div>
                  </div>
                    
                </div>
              </div>
            ))}
          </div>
          {chatOpened && <Chat selectedConversation={selectedConversation} company={company} />}
          {chatOpened && <Details />}
        </div>
      </div>
    </div>
  )
}