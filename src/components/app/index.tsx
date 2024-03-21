// @ts-nocheck
import './styles.scss';

import React, { useEffect, useState } from 'react';
import { ChatBubbleLeftRightIcon, HomeIcon, ChatBubbleBottomCenterTextIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { HomeIcon as SolidHomeIcon, ChatBubbleBottomCenterTextIcon as SolidChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid'
import Messages from '../messages';
import Start from '../start';
import { useQuery } from 'react-query';
import axios from 'axios';

window.chatConfig = {}
window.appResponse = {}

let hasStarted = false
export default function Home() {
  const [municateOpened, setMunicateOpened] = useState(true)
  const [chatOpened, setChatOpened] = useState(false)
  const [isAppValid, setIsAppValid] = useState(false)
  const [company, setCompany] = useState({})
  const sections = [
    {
      label: 'Início',
      icon: <HomeIcon className="w-8 m-auto" />,
      activeIcon: <SolidHomeIcon className="w-8 m-auto" />,
      component: <Start chatOpened={chatOpened} setChatOpened={setChatOpened} municateOpened={municateOpened} setMunicateOpened={setMunicateOpened} company={company} />
    },
    {
      label: 'Mensagens',
      icon: <ChatBubbleBottomCenterTextIcon className="w-8 m-auto" />,
      activeIcon: <SolidChatBubbleBottomCenterTextIcon className="w-8 m-auto" />,
      component: <Messages chatOpened={chatOpened} setChatOpened={setChatOpened} municateOpened={municateOpened} setMunicateOpened={setMunicateOpened} company={company} />
    }
  ]
  const [activeTab, setActiveTab] = useState(sections[0].label);

  const { data, status, isLoading } = useQuery({
    queryKey: ['app-' + window.chatConfig.appId],
    queryFn: () => getApp(window.chatConfig.appId),
    refetchOnWindowFocus: false,
  });

  const handleClick = (e, newActiveTab) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  async function getApp () {
    // localStorage.clear()
    if (!window.chatConfig.appId) return
    let visitorToken = ''
    const storedUserId = localStorage.getItem('userId')
    const userId = window.chatConfig.userId || localStorage.getItem('anonymousId')
    visitorToken = localStorage.getItem('visitorToken') || ''
    const response = await axios.post('http://192.168.100.158:3003/companies/app-id', {
      appId: window.chatConfig.appId,
      userId,
      name: window.chatConfig.name,
      email: window.chatConfig.email
    })
    setIsAppValid(response.data.success)
    setCompany(response.data.company)
    const isDifferentId = response.data.userId !== storedUserId
    if (response.data.success) {
      if (!window.chatConfig.userId) {
        localStorage.setItem('anonymousId', response.data.userId)
      }
      window.top.postMessage({ type: 'set-visitor-token', visitorToken: response.data.visitorToken, userId: response.data.userId }, '*')
    }
    window.appResponse = response.data
  }

  window.onmessage = (event) => {
    if (event.data.type === 'set-visitor-token') {
      localStorage.setItem('visitorToken', event.data.visitorToken)
      localStorage.setItem('userId', event.data.userId)
    }
    if (hasStarted) return
    if (event.data.type === 'get-config') {
      window.chatConfig = event.data
      window.chatConfig.userId = window.chatConfig.userId || localStorage.getItem('anonymousId')
      hasStarted = true
    }
  }

  window.top.postMessage({ type: 'get-config' }, '*')

  return (
    <main className="chat-ui min-h-screen bg-white">
      {isAppValid && !isLoading && <div id="chat-container" className={`municate-chat ${municateOpened ? 'opened' : 'closed'} fixed shadow-2xl bg-white w-full rounded-lg top-[0px] h-[100dvh] flex flex-col`}>
        {activeTab === 'Mensagens' && !chatOpened && <div className="text-center text-white bg-blue-700 rounded-t-lg p-[10px] flex">
          <div className="w-12"></div>
          <h1 className="m-auto"><b>MENSAGENS</b></h1>
          <button onClick={() => {
              window.top.postMessage({ type: 'open-chat' }, '*')
            }} className="mr-[10px] hover:bg-blue-200 p-1 rounded-md ms-2">
            <XMarkIcon className="w-7"></XMarkIcon>
          </button>
        </div>}
        <div className="pb-0 grow overflow-auto">
          {sections.map(child => {
            if (child.label === activeTab) {
              return <div key={child.label}>{child.component}</div>;
            }
            return null;
          })}
        </div>
        {!chatOpened && <div className="flex text-base">
          {sections.map(child => (
            <button
              key={child.label}
              className={`${
                activeTab === child.label ? 'text-blue-700' : 'text-gray-700'
              } flex-1 font-normal py-2 hover:text-blue-700 border-t-[3px] border-gray-300`}
              onClick={e => handleClick(e, child.label)}
            >
              {activeTab === child.label ? child.activeIcon : child.icon}
              {child.label}
            </button>
          ))}
        </div>}
      </div>}
      {!isAppValid && !isLoading && <p>App not valid</p>}
      {/* <div id="chat-button" className="fixed text-white bg-blue-700 rounded-full cursor-pointer p-3 transition ease-in-out hover:scale-110 duration-300 right-5 bottom-5 w-16"
           onClick={() => setMunicateOpened(!municateOpened)}>
        <ChatBubbleLeftRightIcon></ChatBubbleLeftRightIcon>
      </div> */}
    </main>
  );
}
