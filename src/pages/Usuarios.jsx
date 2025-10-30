import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Usuarios() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'user' });

  async function load() {
    const { data } = await api.get('/api/admin/users');
    setRows(data.data || []);
  }
  useEffect(()=>{ load(); },[]);

  async function createUser(e){
    e.preventDefault();
    await api.post('/api/admin/users', form);
    setForm({ name:'', email:'', password:'', role:'user' });
    await load();
  }

  async function setRole(id, role){ await api.patch(`/api/admin/users/${id}/role`, { role }); await load(); }
  async function setActive(id, isActive){ await api.patch(`/api/admin/users/${id}/active`, { isActive }); await load(); }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Gestão de Utilizadores</h1>
      <form onSubmit={createUser} className="space-y-2 max-w-md">
        <input className="border rounded p-2 w-full" placeholder="Nome" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <input className="border rounded p-2 w-full" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input className="border rounded p-2 w-full" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        <select className="border rounded p-2 w-full" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="user">Utilizador</option>
          <option value="moderator">Moderador</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Criar</button>
      </form>

      <table className="mt-8 w-full text-left text-sm">
        <thead><tr><th>Nome</th><th>Email</th><th>Papel</th><th>Ativo</th><th>Ações</th></tr></thead>
        <tbody>
          {rows.map(u=>(
            <tr key={u._id} className="border-t">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <select className="border rounded p-1" value={u.role} onChange={e=>setRole(u._id, e.target.value)}>
                  <option value="user">user</option>
                  <option value="moderator">moderator</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td>{u.isActive ? 'Sim' : 'Não'}</td>
              <td>
                <button onClick={()=>setActive(u._id, !u.isActive)} className="border px-3 py-1 rounded">
                  {u.isActive ? 'Desativar' : 'Ativar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
