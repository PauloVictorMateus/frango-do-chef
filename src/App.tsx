import { useState, useEffect } from "react";
import ClientForm from "./components/ClientForm";
import ClientList from "./components/ClientList";
import NotaFiscal from "./components/NotaFiscal";
import { Client, NotaFiscalData } from "./types";
import "./App.css";

function App() {
  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : [];
  });
  
  const [notaFiscalData, setNotaFiscalData] = useState<NotaFiscalData | null>(null);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const addClient = (client: Client) => setClients([...clients, client]);

  const removeClient = (id: number) => {
    setClients(clients.filter((client) => client.id !== id));
  };

  const generateNotaFiscal = (data: NotaFiscalData) => {
    setNotaFiscalData(data);
  };

  return (
    <div className="container">
      <h1>Gestão de Notas Fiscais</h1>
      <h2 className="company-name">Frango do Chefe</h2>

      <ClientForm onAddClient={addClient} />
      <ClientList clients={clients} onRemoveClient={removeClient} />
      <NotaFiscal clients={clients} onGenerate={generateNotaFiscal} notaFiscalData={notaFiscalData} />
    </div>
  );
}

export default App;
