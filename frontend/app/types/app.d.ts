interface Receipt {
  id: string;
  store: string;
  date: string;
  total: number;
  items: number;
}

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}
