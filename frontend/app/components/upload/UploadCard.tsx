import { Upload, Loader2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

interface UploadCardProps {
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  setItems: React.Dispatch<React.SetStateAction<ReceiptItem[]>>;
}

export function UploadCard({ uploading, setUploading, setUploaded, setItems }: UploadCardProps) {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload();
    }
  };

  const handleUpload = () => {
    setUploading(true);
    // Simulate upload and parsing
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
      const mockItems = [
        { id: "1", name: "Organic Bananas", price: 4.99, quantity: 1, category: "Fresh Produce" },
        { id: "2", name: "Milk 2L", price: 3.49, quantity: 2, category: "Dairy" },
        { id: "3", name: "Chicken Breast 500g", price: 12.99, quantity: 1, category: "Meat & Seafood" },
        { id: "4", name: "Bread Wholemeal", price: 3.20, quantity: 1, category: "Pantry" },
        { id: "5", name: "Tomatoes", price: 5.80, quantity: 1, category: "Fresh Produce" },
      ];
      setItems(mockItems);
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleUpload();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`border-2 border-dashed border-gray-300 rounded-lg p-12 text-center transition-colors ${uploading ? 'bg-gray-100' : 'hover:border-blue-500'}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="text-gray-600">Processing your receipt...</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag and drop your receipt here</p>
              <p className="text-gray-500 mb-4">or</p>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button asChild><span>Choose File</span></Button>
              </label>
              <input id="file-upload" type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
              <p className="text-gray-400 mt-4">Supports: JPG, PNG, PDF</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
