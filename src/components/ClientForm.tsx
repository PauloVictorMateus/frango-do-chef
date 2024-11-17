import { useState } from "react";
import { Client } from "../types";

interface ClientFormProps {
  onAddClient: (client: Client) => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ onAddClient }) => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && price) {
      const newClient: Client = {
        id: Date.now(),
        name,
        price: parseFloat(price),
      };
      onAddClient(newClient);
      setName("");
      setPrice("");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome do Cliente"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Valor por quilo"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <button type="submit">Adicionar Cliente</button>
    </form>
  );
};

export default ClientForm;
