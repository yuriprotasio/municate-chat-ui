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

export default function Chat ({ selectedConversation, company }) {
  const Authorization = localStorage.getItem('token')
  moment.locale('pt-br')
  const [chat, setChat] = useState({})
  const chatRef = useRef(chat)
  const [chatIsFull, setChatIsFull] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [showSolid, setShowSolid] = useState(false)
  const [newMessages, setNewMessages] = useState([])
  const [hasNetworkConnection, setHasNetworkConnection] = useState(true)
  const [isOpenCloseLoading, setIsOpenCloseLoading] = useState(false)
  const [isLoadingConversation, setIsLoadingConversation] = useState(false)
  // const [notSendedMessages, setNotSendedMessages] = useState([])

  // const { data, status } = useQuery({
  //   queryKey: ['messages-' + chat?._id],
  //   queryFn: () => getMessages(chat?._id),
  //   refetchOnWindowFocus: false,
  // });

  const { data, status } = useQuery({
    queryKey: ['messages-' + selectedConversation?._id],
    queryFn: () => getMessages(selectedConversation?._id),
    refetchOnWindowFocus: false,
    enabled: !!selectedConversation?._id
  });

  async function getMessages (_id) {
    setIsLoadingConversation(true)
    const response = await axios.post('http://192.168.100.158:3003/chat/get-messages', {
      _id
    }, { headers: { Authorization }})
    setIsLoadingConversation(false)
    set(response, 'data.messagesByDay[0].messages', [...notSendedMessages, ...get(response, 'data.messagesByDay[0].messages', [])])
    return response
  }

  useEffect(() => {
    if (!data) return
    setChat(data?.data)
    chatRef.current = data?.data
  }, [data]);

  // useEffect(() => {
  //   if (chat._id !== selectedConversation._id) {
  //     setChat(selectedConversation)
  //   }
  // }, [selectedConversation])

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
    setIsLoadingConversation(true)
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
    setIsLoadingConversation(false)
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

  function _sendMessage (e, isClick) {
    const eTargetValid = e?.target?.value?.replace(/(\r\n|\n|\r)/gm, "")
    const textInputValid = textInput.replace(/(\r\n|\n|\r)/gm, "")
    if (!eTargetValid && !textInputValid) return setTextInput('')
    if ((e.keyCode == 13 && !e.shiftKey) || isClick) {
      if (!eTargetValid.trimStart() && !textInputValid.trimStart()) return setTextInput('')
      const newMessage = { _id: get(chat, '_id'), companyId: company._id, message: textInput, from: 'company' }
      setTextInput('')
      const messagesByDay = get(chat, 'messagesByDay', [{ messages: []}])
      set(messagesByDay, '[0].messages', [{ message: e.target.value, from: 'company' }, ...get(messagesByDay, '[0].messages')])
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
    const isNearClientHeight = (scrolled - e.target.clientHeight) === 0
    if (isNearClientHeight && !chatIsFull) {
      const lastMessagesByDay = last(chat.messagesByDay)
      const lastMessageByDay = last(lastMessagesByDay.messages)
      if (isLoadingConversation) return
      setIsLoadingConversation(true)
      const response = await axios.post('http://192.168.100.158:3003/chat/get-messages', { _id: get(chat, '_id'), lastMessageId: get(lastMessageByDay, '_id') })
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
      setIsLoadingConversation(false)
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
    const receivedText = newerMessage.from !== 'customer' ? 'Enviado ' : 'Recebido '
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

  async function closeConversation (conversation, close) {
    setIsOpenCloseLoading(true)
    const action = close ? 'closed' : 'opened'
    const response = await axios.get('http://192.168.100.158:3003/chat/change?status=' + action + '&conversationId=' + conversation._id, { headers: { Authorization: localStorage.getItem('token') }})
    if (response?.data?.success) {
      setChat({ ...chat, isActive: !close})
    }
    setIsOpenCloseLoading(false)
  }

  return (
    <div className="w-6/12 border-gray-200 border-l h-[100dvh] shadow-[0_0_15px_0_rgba(0,0,0,0.3)] bg-gray-50 flex flex-col">
      <div>
        <p className="float-left font-bold pb-[0] mt-[15px] pl-[15px]">{chat?.customer?.name || 'Novo Cliente'}</p>
        {chat?.isActive && !isLoadingConversation && <button disabled={isOpenCloseLoading} className="float-right bg-red-600 text-sm font-bold text-white rounded-lg py-[2px] px-[6px] hover:bg-red-500 mt-[16px] mr-[20px]" type="button" onClick={() => closeConversation(chat, true)}>Encerrar Conversa</button>}
        {!chat?.isActive && !isLoadingConversation && <button disabled={isOpenCloseLoading} className="float-right bg-blue-600 text-sm font-bold text-white rounded-lg py-[2px] px-[6px] hover:bg-blue-500 mt-[16px] mr-[20px]" type="button" onClick={() => closeConversation(chat, false)}>Reabrir Conversa</button>}
      </div>
      <div className="flex flex-col h-[100%]">
        <div className="flex border-b-[1px] border-gray-300 pb-2 py-2"></div>
        <div className="overflow-auto flex flex-col-reverse overflow-anchor-none grow mb-[10px]" onScroll={handleScroll}>
        {newMessages.map(item => (
            <div>
              {item.message}<br></br>
            </div>
          ))}
          {chat?.messagesByDay?.map((messageByDay, byDayIndex) => (
            <div key={messageByDay.date}>
              {isLoadingConversation && <svg className="animate-spin h-5 w-5 text-gray-500 mx-auto my-[10px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>}
              <div className="text-center mb-[10px]">{messageByDay.date}</div>
              <div className="flex flex-col-reverse">
                {messageByDay.messages.map((item, index) => (
                  <div key={item._id}>
                    <div className={`${item.from !== 'customer' ? 'flex flex-row-reverse mr-[5px]' : 'flex ml-[5px]'} my-[1px]`}>
                      <div className={`${item.from !== 'customer' && item._id ?
                      'bg-blue-700 text-white' : item.from === 'customer' && item._id ?
                      'bg-slate-200 text-black' : ''} ${!item._id && 'bg-blue-300 text-white'} pl-[10px] pr-[10px] p-[5px] w-fit rounded-md whitespace-pre-wrap tooltip  max-w-[290px] overflow-break-word`}>
                        <div>{item.message}</div>
                        <span className={`${item.from !== 'customer' ? 'tooltip-top-right' : 'tooltip-top-left'} tooltip-text`}>{moment(item.date).format('LLL')}</span>
                      </div>
                    </div>
                    <div className={`${item.from !== 'customer' ? 'text-right pr-[10px]' : 'text-left pl-[10px]'}`}>{sentAgo(item, index, byDayIndex)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {!hasNetworkConnection && <div className="bg-red-500 text-center text-white">
          Sem conexão com a internet  
        </div>}
        {(chat?.isActive || chat?.newChat) && <div className={`border-t-[1px] border-gray-300 flex p-1 items-end`}>
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
        {!chat?.isActive && !isLoadingConversation && <div className="border-gray-300 border-t-[1px] text-center font-bold p-[15px]">
          Atendimento Encerrado
        </div>}
      </div>
    </div>
  )
}