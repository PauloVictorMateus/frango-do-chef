import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Client, NotaFiscalData } from "../types";


interface NotaFiscalProps {
  clients: Client[];
  notaFiscalData: NotaFiscalData | null;
  onGenerate: (data: NotaFiscalData) => void;
}

const NotaFiscal: React.FC<NotaFiscalProps> = ({ clients }) => {
  // Inicializa o estado com dados do localStorage, se existirem
  const [pedidos, setPedidos] = useState<NotaFiscalData[]>(() => {
    const savedPedidos = localStorage.getItem('pedidos');
    return savedPedidos ? JSON.parse(savedPedidos) : [];
  });
  
  const [clientId, setClientId] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

  // Salva os pedidos no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
  }, [pedidos]);

  const handleGenerate = () => {
    const client = clients.find((c) => c.id === parseInt(clientId));
    if (client && weight) {
      const total = client.price * parseFloat(weight);
      const data: NotaFiscalData = {
        clientName: client.name,
        weight: parseFloat(weight),
        pricePerKg: client.price,
        total,
      };
      setPedidos([...pedidos, data]);
      setClientId("");
      setWeight("");
    }
  };

  // Adicione uma função para limpar os pedidos
  const handleClearPedidos = () => {
    setPedidos([]);
    localStorage.removeItem('pedidos');
  };

  const handleGeneratePDF = () => {
    if (pedidos.length === 0) return;
  
    const pdf = new jsPDF();
    pdf.setFont("helvetica", "normal");
  
    // Cabeçalho
    pdf.setFontSize(20);
    pdf.text("Nota Fiscal Frango do Chefe", 20, 20);
    pdf.text(
      `${new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })}`,
      20,
      30
    );
  
    pdf.setLineWidth(0.5);
    pdf.line(20, 35, 180, 35);
  
    // Lista de pedidos
    let yPosition = 50;
    let totalGeral = 0;

    pedidos.forEach((pedido) => {
      pdf.setFontSize(12);
      pdf.text(`Cliente: ${pedido.clientName}`, 20, yPosition);
      pdf.text(`Peso: ${pedido.weight} kg`, 20, yPosition + 7);
      pdf.text(`Valor por quilo: R$ ${pedido.pricePerKg.toFixed(2)}`, 20, yPosition + 14);
      pdf.text(`Subtotal: R$ ${pedido.total.toFixed(2)}`, 20, yPosition + 21);
      pdf.line(20, yPosition + 25, 180, yPosition + 25);
      
      totalGeral += pedido.total;
      yPosition += 35;
    });

    // Total geral
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Total Geral: R$ ${totalGeral.toFixed(2)}`, 20, yPosition);
    
    pdf.save(`Frango do Chefe - Pedidos ${new Date().toLocaleString("pt-BR")}.pdf`);
  };

  // Add this new function to remove a specific order
  const handleRemovePedido = (index: number) => {
    setPedidos(pedidos.filter((_, i) => i !== index));
  };

  return (
    <div className="nota-fiscal">
      <h2>Gerar Nota Fiscal</h2>
      <select onChange={(e) => setClientId(e.target.value)} value={clientId}>
        <option value="">Selecione um Cliente</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Peso (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <button onClick={handleGenerate}>Adicionar Pedido</button>

      {pedidos.length > 0 && (
        <div className="nota-detalhes">
          <h3>Pedidos Adicionados</h3>
          {pedidos.map((pedido, index) => (
            <div key={index} className="pedido-item">
              <p>Cliente: {pedido.clientName}</p>
              <p>Peso: {pedido.weight} kg</p>
              <p>Valor por quilo: R$ {pedido.pricePerKg.toFixed(2)}</p>
              <p>Subtotal: R$ {pedido.total.toFixed(2)}</p>
              <button 
                onClick={() => handleRemovePedido(index)}
                className="remove-button"
              >
                Remover Pedido
              </button>
            </div>
          ))}
          <p className="total-geral">
            Total Geral: R$ {pedidos.reduce((acc, pedido) => acc + pedido.total, 0).toFixed(2)}
          </p>
          <div className="button-group">
            <button onClick={handleGeneratePDF}>Gerar PDF</button>
            <button onClick={handleClearPedidos} className="clear-button">Limpar Pedidos</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotaFiscal;
