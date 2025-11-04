import { Loader2, Trash2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Spinner } from "../ui/spinner";

interface ReceiptDetailDialogProps {
  isOpen: boolean;
  receipt: Receipt | null;
  onClose: () => void;
  onDelete: () => void;
}

export function ReceiptDetailDialog({ isOpen, receipt, onClose, onDelete }: ReceiptDetailDialogProps) {
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const getReceiptDetail = () => {
    setLoading(true);
    setItems([]);
    setTimeout(() => {
      setItems([
        { id: "1", name: "Organic Bananas", price: 4.99, quantity: 1, category: "Fresh Produce" },
        { id: "2", name: "Milk 2L", price: 3.49, quantity: 2, category: "Dairy" },
        { id: "3", name: "Chicken Breast 500g", price: 12.99, quantity: 1, category: "Meat & Seafood" },
        { id: "4", name: "Bread Wholemeal", price: 3.20, quantity: 1, category: "Pantry" },
      ]);
      setCategories([
        "Fresh Produce",
        "Dairy",
        "Meat & Seafood",
        "Pantry",
        "Snacks",
        "Beverages",
        "Household",
        "Personal Care",
        "Other",
      ]);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (isOpen) {
      getReceiptDetail();
    }
  }, [isOpen]);

  // Save category changes
  const [loadingSave, setLoadingSave] = useState(false);
  const updateCategory = (itemId: string, newCategory: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, category: newCategory } : item
      )
    );
  };

  const saveChanges = () => {
    setLoadingSave(true);
    setTimeout(() => {
      setLoadingSave(false);
      toast.success("Changes saved!");
    }, 400);
  };

  // Delete receipt
  const [loadingDelete, setLoadingDelete] = useState(false);
  const deleteReceipt = () => {
    setLoadingDelete(true);
    setTimeout(() => {
      toast.success("Receipt deleted.");
      setLoadingDelete(false);
      onDelete();
    }, 400);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  if (!receipt) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Receipt Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            { loading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-gray-500 animate-spin" />
              </div>
            )
            : (<>
              {/* Store Info */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900 font-medium">{receipt.store}</h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(receipt.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="secondary">{items.length} items</Badge>
              </div>

              <Separator />

              {/* Desktop Table */}
              <div className="flex-1 overflow-y-auto mt-4 pr-2">
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
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>NZD ${item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <Select
                            value={item.category}
                            onValueChange={(v) => updateCategory(item.id, v)}
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card List */}
              <div className="md:hidden space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <div className="text-gray-900">{item.name}</div>
                      <div className="text-gray-900 font-medium">
                        NZD ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600 text-sm">
                        Qty: {item.quantity}
                      </div>
                      <Select
                        value={item.category}
                        onValueChange={(v) => updateCategory(item.id, v)}
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

              <Separator />

              {/* Total */}
              <div className="flex justify-between text-gray-900 font-medium">
                <span>Total</span>
                <span>NZD ${receipt.total.toFixed(2)}</span>
              </div>
            </>) }
 
            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="default"
                className="flex-1"
                onClick={saveChanges}
                disabled={loading || loadingSave || loadingDelete}
              >
                {loadingSave ? <Spinner /> : ""}
                Save
              </Button>
              <DeleteAlertDialog
                disabled={loading || loadingSave || loadingDelete}
                loading={loadingDelete}
                deleteReceipt={deleteReceipt}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

const DeleteAlertDialog = ({ disabled, loading, deleteReceipt }: {
  disabled: boolean;
  loading: boolean;
  deleteReceipt: () => void;
}) => {

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="flex-1"
          disabled={disabled}
        >
          {loading ? <Spinner /> : <Trash2 className="w-4 h-4 mr-2" />}
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this receipt?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The receipt will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteReceipt}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
