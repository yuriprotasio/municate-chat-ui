import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerService from "../components/customer-service";
import { useQuery } from "react-query";
import axios from "axios";
import { get, size } from "lodash";
import Profile from "../components/settings/profile/profile";
import Team from "../components/settings/team/team";
import Kanban from "../components/kanban";

// @ts-nocheck
export default function Dashboard( { tabActive, subTabActive }: any ) {
  const navigate = useNavigate()

  const { data: userInfo } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUserInfo(),
    refetchOnWindowFocus: false,
  });

  const { data: company } = useQuery({
    queryKey: ['company'],
    queryFn: () => getCompany(),
    refetchOnWindowFocus: false,
    enabled: size(get(userInfo, 'data.companiesIds')) > 0
  });

  async function getUserInfo () {
    return axios.get('http://192.168.100.158:3003/users/info', {
      headers: { Authorization: localStorage.getItem('token') }
    })
  }

  async function getCompany () {
    return axios.get('http://192.168.100.158:3003/companies/info/' + get(userInfo, 'data.companiesIds[0]'), {
      headers: { Authorization: localStorage.getItem('token') }
    })
  }

  function logout() {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div>
      <div className="flex flex-col w-52 z-50 top-0 bottom-0 fixed">
        <div className="px-[1.5rem] bg-white border gap-y-[1.25rem] flex flex-col grow">
          <div className="h-[4rem] flex flex-col mt-[20px] text-center">
            <img className="h-[2rem]" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&amp;shade=600" alt="Your Company" />
            <span className="text-lg font-semibold">{get(userInfo, 'data.companyInfo.name', '')}</span>
          </div>
          <nav className="flex flex-col flex-1">
            <ul role="list" className="gap-y-[1.75rem] flex flex-col flex-1">
              <li>
                <ul role="list" className="mx-[-0.5rem]">
                  <li className="mt-[5px]">
                    <Link to="/chat/inbox">
                      <a className={`${(tabActive === 'Atendimento' || !tabActive) && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] rounded-lg hover:bg-gray-100 font-semibold`}>
                        <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={`${tabActive === 'Atendimento' ? 'text-indigo-500' : 'text-gray-500'} w-[1.5rem]`}>
                          <path clipRule="evenodd" fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"></path>
                        </svg>
                        Atendimento
                      </a>
                    </Link>
                  </li>
                  <li className="mt-[5px]">
                    <Link to="/kanban">
                      <a className={`${tabActive === 'CRM' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] rounded-lg hover:bg-gray-100 font-semibold`}>
                        <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={`${tabActive === 'CRM' ? 'text-indigo-500' : 'text-gray-500'} w-[1.5rem]`}>
                          <path clipRule="evenodd" fillRule="evenodd" d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 18.375V5.625ZM21 9.375A.375.375 0 0 0 20.625 9h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5Zm0 3.75a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5Zm0 3.75a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5ZM10.875 18.75a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5ZM3.375 15h7.5a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375Zm0-3.75h7.5a.375.375 0 0 0 .375-.375v-1.5A.375.375 0 0 0 10.875 9h-7.5A.375.375 0 0 0 3 9.375v1.5c0 .207.168.375.375.375Z"></path>
                        </svg>
                        CRM
                      </a>
                    </Link>
                  </li>
                  {/* <li className="mt-[5px]">
                    <Link to="/marketing">
                      <a className={`${tabActive === 'Marketing' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] rounded-lg hover:bg-gray-100 font-semibold`}>
                        <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={`${tabActive === 'Marketing' ? 'text-indigo-500' : 'text-gray-500'} w-[1.5rem]`}>
                          <path clipRule="evenodd" fillRule="evenodd" d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.424.474l.329-.987h8.418l.33.987a.75.75 0 0 0 1.422-.474l-1.17-3.513H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.54 15h6.42l.5 1.5H8.29l.5-1.5Zm8.085-8.995a.75.75 0 1 0-.75-1.299 12.81 12.81 0 0 0-3.558 3.05L11.03 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l2.47-2.47 1.617 1.618a.75.75 0 0 0 1.146-.102 11.312 11.312 0 0 1 3.612-3.321Z"></path>
                        </svg>
                        Marketing
                      </a>
                    </Link>
                  </li>
                  <li className="mt-[5px]">
                    <Link to="/team">
                      <a className={`${tabActive === 'Equipe' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] rounded-lg hover:bg-gray-100 font-semibold`}>
                        <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={`${tabActive === 'Equipe' ? 'text-indigo-500' : 'text-gray-500'} w-[1.5rem]`}>
                          <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z"></path>
                        </svg>
                        Equipe
                      </a>
                    </Link>
                  </li>
                  <li className="mt-[5px]">
                    <Link to="/call">
                      <a className={`${tabActive === 'Telefone' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] rounded-lg hover:bg-gray-100 font-semibold`}>
                        <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={`${tabActive === 'Telefone' ? 'text-indigo-500' : 'text-gray-500'} w-[1.5rem]`}>
                          <path clipRule="evenodd" fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"></path>
                        </svg>
                        Telefone
                      </a>
                    </Link>
                  </li>
                  <li className="mt-[5px]">
                    <Link to="/visitors">
                      <a className={`${tabActive === 'Visitantes' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] rounded-lg hover:bg-gray-100 font-semibold`}>
                        <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={`${tabActive === 'Visitantes' ? 'text-indigo-500' : 'text-gray-500'} w-[1.5rem]`}>
                          <path clipRule="evenodd" fillRule="evenodd" d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm18 3H3.75v9a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V9Zm-15-3.75A.75.75 0 0 0 4.5 6v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75H5.25Zm1.5.75a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V6Zm3-.75A.75.75 0 0 0 9 6v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75H9.75Z"></path>
                        </svg>
                        Visitantes
                      </a>
                    </Link>
                  </li>
                  <li className="mt-[5px]">
                    <Link to="/settings">
                      <a className={`${tabActive === 'Estatísticas' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] rounded-lg hover:bg-gray-100 font-semibold`}>
                        <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={`${tabActive === 'Estatísticas' ? 'text-indigo-500' : 'text-gray-500'} w-[1.5rem]`}>
                          <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z"></path>
                        </svg>
                        Estatísticas
                      </a>  
                    </Link>
                  </li>
                  <li className="mt-[5px]">
                    <Link to="/billing">
                      <a className={`${tabActive === 'Faturamento' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] rounded-lg hover:bg-gray-100 font-semibold`}>
                        <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={`${tabActive === 'Faturamento' ? 'text-indigo-500' : 'text-gray-500'} w-[1.5rem]`}>
                          <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z"></path>
                          <path clipRule="evenodd" fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"></path>
                        </svg>
                        Faturamento
                      </a>
                    </Link>
                  </li> */}
                </ul>
              </li>
              {/* <li>
                <div className="text-gray-400 font-semibold text-left">Your CRMs</div>
                <ul role="list" className="mx-[-0.5rem]">
                  <li><a href="#" onClick={() => setTabActive('HeroIcon')} className={`${tabActive === 'HeroIcon' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] rounded-lg hover:bg-gray-100 font-semibold`}><span className="axo afu bqh brq lx oc se ur yz ze adt aez avv awd alm">H</span><span className="adl">Heroicons</span></a></li>
                  <li><a href="#" onClick={() => setTabActive('Tailwind')} className={`${tabActive === 'Tailwind' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] rounded-lg hover:bg-gray-100 font-semibold`}><span className="axo afu bqh brq lx oc se ur yz ze adt aez avv awd alm">T</span><span className="adl">Tailwind Labs</span></a></li>
                  <li><a href="#" onClick={() => setTabActive('Work')} className={`${tabActive === 'Work' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] rounded-lg hover:bg-gray-100 font-semibold`}><span className="axo afu bqh brq lx oc se ur yz ze adt aez avv awd alm">W</span><span className="adl">Workcation</span></a></li>
                </ul>
              </li> */}
              <li className="mt-auto mx-[-1.5rem]">
                <Link to="/settings">
                  <a className={`${tabActive === 'Configurações' ? 'bg-gray-100' : 'bg-white' } text-gray-700 font-semibold py-[0.75rem] px-[1.5rem] gap-x-[1rem] items-center flex hover:bg-gray-100 cursor-pointer`}>
                    <img className="w-[2rem] rounded-full bg-white h-[2rem]" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="" />
                    <span aria-hidden="true">Configurações</span>
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {tabActive === 'Configurações' && <div className="flex flex-col w-52 z-50 top-0 bottom-0 fixed ml-[201px]">
        <div className="bg-white border gap-y-[1.25rem] flex flex-col grow">
          <nav className="flex flex-col flex-1">
            <ul role="list" className="gap-y-[1.75rem] flex flex-col flex-1">
              <li className="mt-[1rem]">
                <div className="text-gray-400 font-semibold text-left ml-[0.5rem]">Sistema</div>
                <ul role="list" className="">
                  {/* <li className="mt-[5px]">
                    <Link to="/settings/channels">
                      <a className={`${subTabActive === 'Canais' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] hover:bg-gray-100 font-semibold`}>
                        Canais
                      </a>
                    </Link>
                  </li> */}
                  <li className="mt-[5px]">
                    <Link to="/settings/team">
                      <a className={`${subTabActive === 'Equipe' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] hover:bg-gray-100 font-semibold`}>
                        Equipe
                      </a>
                    </Link>
                  </li>
                  {/* <li className="mt-[5px]">
                    <Link to="/settings/call">
                      <a className={`${subTabActive === 'Créditos para Ligações' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] hover:bg-gray-100 font-semibold`}>
                        Créditos para Ligações
                      </a>
                    </Link>
                  </li> */}
                  <li className="mt-[5px]">
                    <Link to="/settings/kanban">
                      <a className={`${subTabActive === 'Ajustes CRM' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] hover:bg-gray-100 font-semibold`}>
                        Ajustes CRM
                      </a>
                    </Link>
                  </li>
                  {/*<li className="mt-[5px]">
                    <Link to="/settings/extensions">
                      <a className={`${subTabActive === 'Extensões' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] hover:bg-gray-100 font-semibold`}>
                        Extensões
                      </a>
                    </Link>
                  </li>
                  <li className="mt-[5px]">
                    <Link to="/settings/chat-routing">
                      <a className={`${subTabActive === 'Roteamento de chats' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] hover:bg-gray-100 font-semibold`}>
                        Roteamento de chats
                      </a>
                    </Link>
                  </li>
                  <li className="mt-[5px]">
                    <Link to="/settings/restore-chat">
                      <a className={`${subTabActive === 'Resgatar chat' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] hover:bg-gray-100 font-semibold`}>
                        Resgatar chat
                      </a>
                    </Link>
                  </li> */}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="text-gray-400 font-semibold text-left ml-[0.5rem]">Meu</div>
                <ul role="list">
                  <li><Link to="/settings/profile"><a className={`${subTabActive === 'Meu Perfil' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] hover:bg-gray-100 font-semibold cursor-pointer`}><span>Meu perfil</span></a></Link></li>
                  <li><a onClick={() => logout()} className={`${subTabActive === 'Tailwind' && 'text-indigo-500 bg-gray-100'} text-gray-700 flex p-[0.5rem] gap-x-[0.75rem] hover:bg-gray-100 font-semibold cursor-pointer`}><span>Deslogar</span></a></li>
                </ul>
              </li>
              {/* <li className="mt-auto mx-[-1.5rem]">
                <a href="#" onClick={() => setSubTabActive('Profile')} className="text-gray-700 font-semibold py-[0.75rem] px-[1.5rem] gap-x-[1rem] items-center flex hover:bg-gray-100">
                  <img className="w-[2rem] rounded-full bg-white h-[2rem]" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="" />
                  <span aria-hidden="true">Tom Cook</span>
                </a>
              </li> */}
            </ul>
          </nav>
        </div>
      </div>}
      <main className={`${subTabActive ? 'pl-[408px]' : 'pl-[207px]'}`}>
        {tabActive === 'Atendimento' && <CustomerService company={company?.data} userInfo={userInfo?.data} />}
        {tabActive === 'CRM' && <Kanban />}
        {subTabActive === 'Meu Perfil' && <Profile company={company?.data} />}
        {subTabActive === 'Equipe' && <Team userInfo={userInfo?.data} company={company?.data} />}
      </main>
    </div>
  )
}