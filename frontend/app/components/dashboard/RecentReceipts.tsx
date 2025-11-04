import { Eye, Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useEffect, useState } from "react";
import { ReceiptDetailDialog } from "./ReceiptDetailDialog";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "../ui/pagination";
import { ALL_MONTHS, ALL_YEARS, RecentReceiptFilters } from "./RecentReceiptFilters";

export const RecentReceipts = () => {
  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const onClickPrevious = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  const onClickNext = () => {
    setPage((p) => Math.min(p + 1, totalPages));
  };

  // Filter State
  const [selectedYear, setSelectedYear] = useState(ALL_YEARS);
  const [selectedMonth, setSelectedMonth] = useState(ALL_MONTHS);
  const [years, setYears] = useState<string[]>([]);

  const onYearChange = (year: string) => {
    setSelectedYear(year);
    setPage(1);
  };

  const onMonthChange = (month: string) => {
    setSelectedMonth(month);
    setPage(1);
  }

  // Data State
  const [recentReceipts, setRecentReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = () => {
    setLoading(true);
    // Fetch recent receipts from backend (mocked here)
    setTimeout(() => {
      // This would be replaced with an actual API call
      const res = {
        "data": [
          { id: "1", store: "Countdown", date: "2025-01-28", total: 89.90, items: 12 },
          { id: "2", store: "New World", date: "2025-01-25", total: 142.50, items: 18 },
          { id: "3", store: "Pak'nSave", date: "2025-01-22", total: 67.80, items: 8 },
          { id: "4", store: "Countdown", date: "2025-01-20", total: 45.30, items: 6 },
          { id: "5", store: "Fresh Choice", date: "2025-01-18", total: 124.20, items: 15 },
          { id: "6", store: "New World", date: "2025-01-15", total: 98.40, items: 11 },
          { id: "7", store: "Pak'nSave", date: "2025-01-10", total: 75.50, items: 9 },
          { id: "8", store: "Countdown", date: "2025-01-05", total: 63.20, items: 7 },
          { id: "9", store: "Countdown", date: "2025-01-05", total: 63.20, items: 7 },
          { id: "10", store: "Countdown", date: "2025-01-05", total: 63.20, items: 7 },
        ],
        "totalPages": 5,
        "years": [ALL_YEARS, "2025"],
      };
      setRecentReceipts(res.data);
      setTotalPages(res.totalPages);
      setYears(res.years);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    getData();
  }, [page, selectedYear, selectedMonth]);

  // Receipt Detail Dialog State
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt|null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const onViewReceipt = (receipt:Receipt) => {
    setSelectedReceipt(receipt);
    setShowDetailDialog(true);
  }

  const onCloseReceipt = () => {
    setSelectedReceipt(null);
    setShowDetailDialog(false);
  }

  const onDeleteReceipt = () => {
    setSelectedReceipt(null);
    // After deletion, refresh the data
    getData();
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle>Recent Receipts</CardTitle>
              <CardDescription>Your latest uploaded receipts</CardDescription>
            </div>
            {/* Year & Month Filters */}
            <RecentReceiptFilters
              years={years}
              year={selectedYear}
              month={selectedMonth}
              onYearChange={onYearChange}
              onMonthChange={onMonthChange}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block relative">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Items Parsed</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReceipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                    <TableCell>{receipt.store}</TableCell>
                    <TableCell>NZD ${receipt.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{receipt.items} items</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewReceipt(receipt)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={onClickPrevious}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <PaginationItem>
                  <PaginationNext
                    onClick={onClickNext}
                    className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <ReceiptDetailDialog
        isOpen={showDetailDialog}
        receipt={selectedReceipt}
        onClose={onCloseReceipt}
        onDelete={onDeleteReceipt}
      />
    </>
  );
};
