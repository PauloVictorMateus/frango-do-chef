import { Client } from "../types";

interface ClientListProps {
  clients: Client[];
  onRemoveClient: (id: number) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onRemoveClient }) => (
  <div className="client-list">
    <h2>Lista de Clientes</h2>
    {clients.length === 0 ? (
      <p>Nenhum cliente cadastrado.</p>
    ) : (
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.name} - R$ {client.price.toFixed(2)} /kg
            <button onClick={() => onRemoveClient(client.id)}>Remover</button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default ClientList;
