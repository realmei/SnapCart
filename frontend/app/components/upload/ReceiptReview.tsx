import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner"
import { useNavigate } from "react-router";
import { Spinner } from "../ui/spinner";

export const ReceiptReview = ({ items, onSave, onCancel }: {
  items: ReceiptItem[];
  onSave: () => void;
  onCancel: () => void;
}) => {
  const [itemList, setItemList] = useState(items);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      // Simulate fetch
      const cats = [
        "Fresh Produce",
        "Dairy",
        "Meat & Seafood",
        "Pantry",
        "Beverages",
        "Snacks",
        "Household Items",
        "Personal Care",
        "Other"
      ];
      setCategories(cats);
    }, 500);
  }, []);

  const updateCategory = (itemId: string, newCategory: string) => {
    setItemList(items.map(item => 
      item.id === itemId ? { ...item, category: newCategory } : item
    ));
  };

  const handleSubmit = () => {
    if (loading) return;
    setLoading(true);
    // Simulate save delay
    setTimeout(() => {
      toast("Receipt has been saved", {
        description: "Go to dashboard to view all receipts",
        action: {
          label: "Dashboard",
          onClick: () => navigate("/dashboard"),
        },
      })
      setLoading(false);
      onSave();
    }, 500);
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          <CardTitle>Receipt Parsed Successfully</CardTitle>
        </div>
        <CardDescription>
          Review the parsed items and adjust categories if needed
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itemList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>NZD ${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Select
                      value={item.category}
                      onValueChange={(value) => updateCategory(item.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
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
              <div className="flex justify-between">
                <div className="text-gray-900">{item.name}</div>
                <div className="text-gray-900">NZD ${item.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-gray-600">Qty: {item.quantity}</div>
                <Select
                  value={item.category}
                  onValueChange={(value) => updateCategory(item.id, value)}
                >
                  <SelectTrigger className="w-[160px]">
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
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">NZD ${total.toFixed(2)}</span>
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