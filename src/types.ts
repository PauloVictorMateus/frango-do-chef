export interface Client {
  id: number;
  name: string;
  price: number; // Valor por quilo
}

export interface NotaFiscalData {
  clientName: string;
  weight: number;
  pricePerKg: number;
  total: number;
}
