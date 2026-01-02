import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "sonner"
import { useNavigate } from "react-router";
import { Spinner } from "~/components/ui/spinner";
import { fetchWithAuth } from "~/lib/fetch";

export const ReceiptReview = ({ receiptData, onSave, onCancel }: {
  receiptData: Receipt;
  onSave: () => void;
  onCancel: () => void;
}) => {
  const [vendor, setVendor] = useState(receiptData.vendor);
  const [date, setDate] = useState(receiptData.date);
  const [itemList, setItemList] = useState<ReceiptItem[]>(receiptData.items);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWithAuth("/api/receipt/categories")
      .then((res) => setCategories(res.categories))
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setCategories([
          "Fresh Produce",
          "Dairy",
          "Meat",
          "Seafood",
          "Pantry",
          "Beverages",
          "Snacks",
          "Household Items",
          "Personal Care",
          "Other",
        ]);
      });
  }, []);

  const updateCategory = (itemId: string, newCategory: string) => {
    setItemList(itemList.map(item => 
      item.id === itemId ? { ...item, category: newCategory } : item
    ));
  };

  const updateItemField = (itemId: string, field: keyof ReceiptItem, value: any) => {
    setItemList(itemList.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetchWithAuth("/api/receipt/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendor,
          date,
          total: itemList.reduce((sum, item) => sum + item.total_price, 0),
          items: itemList,
        }),
      })
      if (!res.ok) {
        throw new Error("Failed to save receipt");
      }
      toast("Receipt has been saved", {
        description: "Go to dashboard to view all receipts",
        action: {
          label: "Dashboard",
          onClick: () => navigate("/dashboard"),
        },
      })
      onSave();
    } catch (err) {
      console.error("Failed to save receipt:", err);
      toast.error("Failed to save receipt");
    }
    setLoading(false);
  };

  const calculatedTotal = itemList.reduce((sum, item) => sum + item.total_price, 0);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          <CardTitle>Receipt Parsed Successfully</CardTitle>
        </div>
        <CardDescription>
          Review and edit the vendor, date, and items below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vendor & Date Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vendor
            </label>
            <Input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="Enter vendor name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itemList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-xs">
                    <Input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItemField(item.id!, "name", e.target.value)}
                      className="text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItemField(item.id!, "quantity", parseFloat(e.target.value))}
                      className="w-20 text-sm"
                      step="1"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => updateItemField(item.id!, "unit_price", parseFloat(e.target.value))}
                      className="w-24 text-sm"
                      step="0.01"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    NZD ${item.total_price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={item.category || "Other"}
                      onValueChange={(value) => updateCategory(item.id!, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile List */}
        <div className="md:hidden space-y-4">
          {itemList.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Item Name</label>
                <Input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItemField(item.id!, "name", e.target.value)}
                  className="text-sm mt-1"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-600">Qty</label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItemField(item.id!, "quantity", parseFloat(e.target.value))}
                    className="text-sm mt-1"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Unit Price</label>
                  <Input
                    type="number"
                    value={item.unit_price}
                    onChange={(e) => updateItemField(item.id!, "unit_price", parseFloat(e.target.value))}
                    className="text-sm mt-1"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Total</label>
                  <div className="text-sm mt-1 font-semibold">
                    ${item.total_price.toFixed(2)}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Category</label>
                <Select
                  value={item.category || "Other"}
                  onValueChange={(value) => updateCategory(item.id!, value)}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-900 font-semibold">Total</span>
            <span className="text-gray-900 font-semibold text-lg">NZD ${calculatedTotal.toFixed(2)}</span>
          </div>
          <div className="flex gap-4">
            <Button onClick={onCancel} className="flex-1" variant="outline" disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
              {loading ? <Spinner /> : ""}
              Submit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}