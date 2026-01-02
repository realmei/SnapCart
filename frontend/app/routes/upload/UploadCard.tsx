import { Upload, Loader2 } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { fetchWithAuth } from "~/lib/fetch";

interface UploadCardProps {
  setUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  setReceiptData: React.Dispatch<React.SetStateAction<Receipt>>;
}

export function UploadCard({ setUploaded, setReceiptData }: UploadCardProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await fetchWithAuth("/api/receipt/upload", {
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append("receipt", file);
          return formData;
        })(),
      });
      setReceiptData(res);
      console.log("Uploaded receipt res:", res);
      setUploaded(true);
    } catch (err) {
      toast.error("Upload failed. Please try again.");
      console.error(err);
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleUpload(e.dataTransfer.files[0]);
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
