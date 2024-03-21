// @ts-nocheck
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import Chat from '../chat'
import { BuildingLibraryIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Start ({ chatOpened, setChatOpened, municateOpened, setMunicateOpened, company }) {
  function openChat () {
    setChatOpened(true)
  }

  return (
    <>
      {chatOpened && <Chat setChatOpened={setChatOpened} municateOpened={municateOpened} setMunicateOpened={setMunicateOpened} company={company} />}
      {!chatOpened && <div className="m-[10px] py-2">
        <div className="flex">
          <div className="w-10/12">
            <div className="w-10">
              <img src={company.logo} className="h-full" />
            </div><br></br>
            {/* <BuildingLibraryIcon ></BuildingLibraryIcon><br></br> */}
            <p>Olá, como podemos ajudar?</p>
          </div>
          <div className="w-2/12 text-right">
            <button onClick={() => {
              window.top.postMessage({ type: 'open-chat' }, '*')
              }} className="mr-[10px] hover:bg-blue-200 p-1 rounded-md ms-2">
              <XMarkIcon className="w-7"></XMarkIcon>
            </button>
          </div>
        </div>
        <br></br>
        <div onClick={openChat} className="cursor-pointer border-[2px] border-gray-300 rounded-md p-[10px] flex send-message">
          <div className="w-10/12">
            <span className="send-message-text"><b>Envie uma mensagem</b></span><br></br>
            <span>Normalmente respondemos em até 30 minutos</span>
          </div>
          <div className="w-2/12 self-center">
            <PaperAirplaneIcon className="w-8 text-blue-700 m-auto"></PaperAirplaneIcon>
          </div>
        </div>
      </div>
      }
    </>
  )
}