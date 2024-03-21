// @ts-nocheck
// import '../../assets/styles/launcher.scss'
import { socket } from '../../providers/socket'
import { BuildingLibraryIcon, ChevronLeftIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PaperAirplaneIcon as SolidPaperAirplaneIcon } from '@heroicons/react/24/solid'
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from "react-query";
import { last, get, set, cloneDeep } from 'lodash'
import * as moment from 'moment'
import Promise from 'bluebird'
import 'moment/locale/pt-br'
// const Authorization = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWViMjVkMjFhODBlMjQ5Zjc1MzFmMGEiLCJuYW1lIjoiWXVyaSBQcm90w6FzaW8gSmVzdXMgZGEgU2lsdmEiLCJjb21wYW55SWRzIjpbXSwiZW1haWwiOiJ5dXJpcHJvdGFzaW9AaG90bWFpbC5jb20iLCJ0eXBlIjoiY3VzdG9tZXIiLCJpYXQiOjE3MTA5NTI3ODZ9._KGkEbORPe2eiKRU2UgSC13y3wg4YEbDuamXwnKh_dU'

// Será usado para integrar o chat
const userId = 'teste'
const userEmail = ''
// ------------------------------
let notSendedMessages = []
let notSendedMessageId = 0

export default function Chat ({ setChatOpened, chatSelected, municateOpened, setMunicateOpened, company }) {
  const Authorization = window?.chatConfig?.Authorization || localStorage.getItem('visitorToken')
  moment.locale('pt-br')
  const [chat, setChat] = useState(chatSelected || {})
  const chatRef = useRef(chat)
  const [chatIsFull, setChatIsFull] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [showSolid, setShowSolid] = useState(false)
  const [newMessages, setNewMessages] = useState([])
  const [hasNetworkConnection, setHasNetworkConnection] = useState(true)
  // const [notSendedMessages, setNotSendedMessages] = useState([])

  const { data, status } = useQuery({
    queryKey: ['messages-' + chatSelected?._id],
    queryFn: () => getMessages(chatSelected?._id),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setChat(data?.data)
    chatRef.current = data?.data
  }, [data]);

  useEffect(() => {
    window.addEventListener('online', () => setHasNetworkConnection(true));
    window.addEventListener('offline', () => setHasNetworkConnection(false));

    return () => {
        window.removeEventListener('online', () => setHasNetworkConnection(true));
        window.removeEventListener('offline', () => setHasNetworkConnection(false));
    };
  }, []);

  useEffect(() => {
    socket.on('message', async (message) => {
      const response = await axios.post('http://192.168.100.158:3003/chat/get-messages', {
        _id: chatRef.current._id
      }, { headers: { Authorization } })
      setChat(response?.data)
      chatRef.current = response?.data
    })

    socket.on('connect', async () => {
      // setHasNetworkConnection(true)
      // listener({ message: 'CONECTADO'})
      // const messagesToSend = messages.filter(message => !message._id)
      await doSomething()
    })

    socket.on('disconnect', () => {
      // setHasNetworkConnection(false)
      // listener({ message: 'DESCONECTADO'})
    })

  }, [])
  
  const listener = (message) => {
    setNewMessages((prevValue) => {
      let newArray = cloneDeep(prevValue)
      newArray = [message, ...newArray]
      return newArray
    })
  }

  async function doSomething () {
    const response = await axios.post('http://192.168.100.158:3003/chat/get-messages', {
      _id: chatRef.current._id
    }, { headers: { Authorization }})

    const newMessagesByDay = response?.data?.messagesByDay
    await Promise.map(notSendedMessages, async (notSendedMessage) => {
      await axios.post('http://192.168.100.158:3003/chat', {...notSendedMessage, _id: get(chatRef, 'current._id')}, { headers: { Authorization }}).then((res) => {
        const notSendedIndex = notSendedMessages.findIndex(message => message.notSendedMessageId === notSendedMessage.notSendedMessageId)
        notSendedMessages = notSendedMessages.slice(notSendedIndex, 1)
      })
    })
    socket.emit('input chat message', notSendedMessage)
    set(newMessagesByDay, '[0].messages', [...notSendedMessages, ...get(newMessagesByDay, '[0].messages')])
    setChat({ ...response?.data, messagesByDay: newMessagesByDay })
    chatRef.current = { ...response?.data, messagesByDay: newMessagesByDay }
  }

  function onChangeTextArea (e) {
    const valueWithoutBreakline = e.target.value.replace(/(\r\n|\n|\r)/gm, "")
    e.target.style.height = '36px';
    if (valueWithoutBreakline) {
      if (e.target.scrollHeight < 100) {
        e.target.style.height = (e.target.scrollHeight)+'px';
      } else {
        e.target.style.height = '108px'
        const lines = textInput.split(/\r|\r\n|\n/);
        if (lines.length === 2) e.target.style.height = '60px'
        if (lines.length === 3) e.target.style.height = '84px'
        if (lines.length >= 4) e.target.style.height = '108px'
      }
    }
    if (!valueWithoutBreakline) return setTextInput('')
    setTextInput(e.target.value)
  }

  async function getMessages (_id) {
    const response = await axios.post('http://192.168.100.158:3003/chat/get-messages', {
      _id
    }, { headers: { Authorization }})

    set(response, 'data.messagesByDay[0].messages', [...notSendedMessages, ...get(response, 'data.messagesByDay[0].messages', [])])
    return response
  }

  function _sendMessage (e, isClick) {
    const eTargetValid = e?.target?.value?.replace(/(\r\n|\n|\r)/gm, "")
    const textInputValid = textInput.replace(/(\r\n|\n|\r)/gm, "")
    if (!eTargetValid && !textInputValid) return setTextInput('')
    if ((e.keyCode == 13 && !e.shiftKey) || isClick) {
      if (!eTargetValid.trimStart() && !textInputValid.trimStart()) return setTextInput('')
      const newMessage = { _id: get(chat, '_id'), companyId: window.appResponse.company._id, message: textInput, from: 'customer' }
      setTextInput('')
      const messagesByDay = get(chat, 'messagesByDay', [{ messages: []}])
      set(messagesByDay, '[0].messages', [{ message: e.target.value, from: 'customer' }, ...get(messagesByDay, '[0].messages')])
      setChat({ ...chat, messagesByDay })
      chatRef.current = { ...chat, messagesByDay }
      axios.post('http://192.168.100.158:3003/chat', newMessage, { headers: { Authorization }}).then((res) => {
        socket.emit('input chat message', newMessage)
      }).catch(() => {
        notSendedMessages.push({ ...newMessage, _id: '', notSendedMessageId })
        notSendedMessageId++
        // setNotSendedMessages((prevValue) => {
        //   return [...prevValue, newMessage]
        // })
      })
    }
  }

  // function checkMessagesToResend (newToResendMessages) {
  //   console.log(newToResendMessages)
  // }

  async function handleScroll (e) {
    let actualMessagesByDay = [...chat.messagesByDay]
    const scrolled = e.target.scrollHeight + e.target.scrollTop
    const isNearClientHeight = (scrolled - e.target.clientHeight) <= 10
    if (isNearClientHeight && !chatIsFull) {
      const lastMessagesByDay = last(chat.messagesByDay)
      const lastMessageByDay = last(lastMessagesByDay.messages)
      const response = await axios.post('http://192.168.100.158:3003/chat/get-messages', { _id: get(chatSelected, '_id'), lastMessageId: get(lastMessageByDay, '_id') })
      response.data?.messagesByDay?.map(item => {
        const newMessagesByDay = chat.messagesByDay.find(chatItem => chatItem.date === item.date)
        if (newMessagesByDay) {
          const actualMessagesByDayIndex = actualMessagesByDay.findIndex(item => item.date === newMessagesByDay.date)
          actualMessagesByDay[actualMessagesByDayIndex].messages = [...actualMessagesByDay[actualMessagesByDayIndex].messages, ...item.messages]
        } else {
          actualMessagesByDay.push(item)
        }
      })
      setChat({ ...chat, messagesByDay: actualMessagesByDay })
      chatRef.current = { ...chat, messagesByDay: actualMessagesByDay }
      if (response.data.chatIsFull) {
        setChatIsFull(true)
      }
    }
  }

  function sentAgo(newerMessage, index, byDayIndex) {
    if (index !== 0 || byDayIndex !== 0) return
    if (!newerMessage._id) return 'Enviando'
    const messageDate = newerMessage.date ? new Date(newerMessage.date) : new Date()
    const receivedText = newerMessage.from === 'customer' ? 'Enviado ' : 'Recebido '
    return receivedText + moment(messageDate).fromNow();
  }

  function getTextAreaSize(textInput) {
    const lines = textInput.split(/\r|\r\n|\n/);
    if (lines.length === 2) return 'h-[60px]'
    if (lines.length === 3) return 'h-[84px]'
    if (lines.length >= 4) return 'h-[108px]'
    return ''
  }

  function _hasValidInput () {
    return !!textInput.replace(/(\r\n|\n|\r)/gm, "")
  }

  return (
    <div className="flex flex-col h-[100dvh] sm:h-[600px]">
      <div className="flex border-b-[2px] border-gray-300 pb-4 py-4">
        <div>
          <button onClick={() => setChatOpened(false)} className="hover:bg-blue-200 p-1 rounded-md ms-2">
            <ChevronLeftIcon className="w-7" />
          </button>
        </div>
        <h1 className="m-auto">{chat?.employee?.name || company.name}</h1>
        <button onClick={() => window.top.postMessage({ type: 'open-chat' }, '*')} className="mr-[10px] hover:bg-blue-200 p-1 rounded-md ms-2">
          <XMarkIcon className="w-7"></XMarkIcon>
        </button>
      </div>
      <div className="overflow-auto flex flex-col-reverse overflow-anchor-none grow" onScroll={handleScroll}>
      {newMessages.map(item => (
          <div>
          {item.message}<br></br>
          </div>
        ))}
        {chat?.messagesByDay?.map((messageByDay, byDayIndex) => (
          <div key={messageByDay.date}>
            <div className="text-center mb-[10px]">{messageByDay.date}</div>
            <div className="flex flex-col-reverse">
              {messageByDay.messages.map((item, index) => (
                <div key={item._id}>
                  <div className={`${item.from === 'customer' ? 'flex flex-row-reverse mr-[5px]' : 'flex ml-[5px]'} my-[1px]`}>
                    {item.from !== 'customer' && <div className="w-8">
                      <img src={company.logo} className="h-full" />
                    </div>}
                    <div className={`${item.from === 'customer' && item._id ?
                    'bg-blue-700 text-white' : item.from !== 'customer' && item._id ?
                    'bg-slate-200 text-black' : ''} ${!item._id && 'bg-blue-300 text-white'} pl-[10px] pr-[10px] p-[5px] w-fit rounded-md whitespace-pre-wrap tooltip  max-w-[290px] overflow-break-word`}>
                      <div>{item.message}</div>
                      <span className={`${item.from === 'customer' ? 'tooltip-top-right' : 'tooltip-top-left'} tooltip-text`}>{moment(item.date).format('LLL')}</span>
                    </div>
                  </div>
                  <div className={`${item.from === 'customer' ? 'text-right pr-[10px]' : 'text-left pl-[10px]'}`}>{sentAgo(item, index, byDayIndex)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {!hasNetworkConnection && <div className="bg-red-500 text-center text-white">
        Sem conexão com a internet  
      </div>}
      {(chat?.isActive || chat?.newChat) && <div className={`border-t-[2px] border-gray-300 flex p-1 items-end`}>
        <textarea
        value={textInput}
        className={`${getTextAreaSize(textInput)} block w-full rounded-md border-0 shadow-none outline-none py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-base sm:leading-6 pl-[10px] pr-[10px] h-[36px] resize-none w-[410px]`}
        placeholder="Escreva sua Mensagem"
        onChange={onChangeTextArea}
        onKeyDown={_sendMessage} />
        <button disabled={!_hasValidInput()} onClick={(e) => _sendMessage(e, true)} className={`${!_hasValidInput() ? 'bg-gray-300' : ''} bg-blue-700 rounded-full cursor-pointer p-1 w-[36px] h-[36px]`} onMouseEnter={() => setShowSolid(true)} onMouseLeave={() => setShowSolid(false)}>
          {showSolid && <SolidPaperAirplaneIcon className="w-[100%] text-white cursor-pointer pl-1" ></SolidPaperAirplaneIcon>}
          {!showSolid && <PaperAirplaneIcon className="w-[100%] text-white pl-1"></PaperAirplaneIcon>}
        </button>
      </div>}
    </div>
  )
}