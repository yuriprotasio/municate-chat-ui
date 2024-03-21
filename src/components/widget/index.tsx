// @ts-nocheck
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

export default function Widget () {
  function openChat () {
    setChatOpened(true)
  }

  return (
    <>
      <div id="chat-button" className="fixed text-white bg-blue-700 rounded-full cursor-pointer p-3 transition ease-in-out hover:scale-110 duration-300 right-5 bottom-5 w-16"
      onClick={() => window.postMessage('open-chat')}>
        <ChatBubbleLeftRightIcon></ChatBubbleLeftRightIcon>
      </div>
    </>
  )
}