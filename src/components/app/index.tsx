// @ts-nocheck
import './styles.scss';

import React, { useEffect, useState } from 'react';
import { ChatBubbleLeftRightIcon, HomeIcon, ChatBubbleBottomCenterTextIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { HomeIcon as SolidHomeIcon, ChatBubbleBottomCenterTextIcon as SolidChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid'
import Messages from '../messages';
import Start from '../start';

export default function Home() {
  const [municateOpened, setMunicateOpened] = useState(false)
  const [chatOpened, setChatOpened] = useState(false)
  const sections = [
    {
      label: 'Início',
      icon: <HomeIcon className="w-8 m-auto" />,
      activeIcon: <SolidHomeIcon className="w-8 m-auto" />,
      component: <Start chatOpened={chatOpened} setChatOpened={setChatOpened} municateOpened={municateOpened} setMunicateOpened={setMunicateOpened} />
    },
    {
      label: 'Mensagens',
      icon: <ChatBubbleBottomCenterTextIcon className="w-8 m-auto" />,
      activeIcon: <SolidChatBubbleBottomCenterTextIcon className="w-8 m-auto" />,
      component: <Messages chatOpened={chatOpened} setChatOpened={setChatOpened} municateOpened={municateOpened} setMunicateOpened={setMunicateOpened} />
    }
  ]
  const [activeTab, setActiveTab] = useState(sections[0].label);

  const handleClick = (e, newActiveTab) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  return (
    <main className="min-h-screen">
      <div className={`municate-chat ${municateOpened ? 'opened' : 'closed'} fixed shadow-2xl bg-white w-full rounded-lg top-[0px] sm:top-[unset] sm:bottom-[95px] sm:w-[450px] h-[100dvh] sm:h-[600px] sm:right-5 flex flex-col`}>
        {activeTab === 'Mensagens' && !chatOpened && <div className="text-center text-white bg-blue-700 rounded-t-lg p-[10px] flex">
          <div className="w-12"></div>
          <h1 className="m-auto"><b>MENSAGENS</b></h1>
          <button onClick={() => setMunicateOpened(!municateOpened)} className="mr-[10px] hover:bg-blue-200 p-1 rounded-md ms-2">
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
      </div>
      <div className="fixed text-white bg-blue-700 rounded-full cursor-pointer p-3 transition ease-in-out hover:scale-110 duration-300 right-5 bottom-5 w-16"
           onClick={() => setMunicateOpened(!municateOpened)}>
        <ChatBubbleLeftRightIcon></ChatBubbleLeftRightIcon>
      </div>
    </main>
  );
}
