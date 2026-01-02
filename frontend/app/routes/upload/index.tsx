import { Navigation } from "../../components/nav/Navigation";
import { useState } from "react";
import { UploadCard } from "./UploadCard";
import { ReceiptReview } from "./ReceiptReview";

export default function UploadPage() {
  const [uploaded, setUploaded] = useState(false);
  const [receiptData, setReceiptData] = useState<Receipt>({} as Receipt);

  const resetUpload = () => {
    setUploaded(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-16 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-gray-900 mb-2">Upload your receipt</h1>
          </div>
          {uploaded ? (
            <ReceiptReview receiptData={receiptData} onSave={resetUpload} onCancel={resetUpload} />
          ) : (
            <UploadCard
              setUploaded={setUploaded} 
              setReceiptData={setReceiptData} 
            />
          )}
        </div>
      </div>
    </div>
  )
}
