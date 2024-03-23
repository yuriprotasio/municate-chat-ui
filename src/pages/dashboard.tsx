import axios from "axios";
import { get } from "lodash";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

// @ts-nocheck
export default function Dashboard () {
  const selectedCompanyId = ''
  const navigate = useNavigate()

  const { data, status, isLoading } = useQuery({
    queryKey: ['dashboard-' + selectedCompanyId],
    queryFn: () => getConversations(),
    refetchOnWindowFocus: false,
  });


  async function getConversations () {
    const response = await axios.post('http://localhost:3003/chat/company/get-chats', { companyId: selectedCompanyId }, {
      headers: { Authorization: localStorage.getItem('token') }
    })
    if (get(response, 'data') === 'Not Authorized') {
      navigate('/login')
      localStorage.clear()
    }
    return response
  }

  function logout () {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div className="container mx-auto text-center">
      <h1>DASHBOARD</h1>
      <button onClick={logout}>Sair</button>
      {get(data, 'data', []).map((conversation: any) => (
        <h1 key={conversation._id}>CONVERSATION</h1>
      ))}
    </div>
  )
}