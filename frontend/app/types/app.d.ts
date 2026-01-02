interface Receipt {
  id: string;
  vendor: string;
  date: string;
  total: number;
  items: ReceiptItem[];
}

interface ReceiptItem {
  id: string;
  name: string;
  unit_price: number;
  total_price: number;
  quantity: number;
  category: string;
}
