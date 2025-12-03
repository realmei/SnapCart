import { Navigation } from "../components/nav/Navigation";
import { useEffect, useState } from "react";
import { ChartsSection } from "~/components/dashboard/ChartsSection";
import { GreetingHeader } from "~/components/dashboard/GreetingHeader";
import { RecentReceipts } from "~/components/dashboard/RecentReceipts";
import { SummaryCards } from "~/components/dashboard/SummaryCards";

export default function DashboardPage() {
  const [lifestyleTags, setLifestyleTags] = useState<Array<{ icon: string; label: string; description: string }>>([]);
  const [summaryData, setSummaryData] = useState({
    monthSpend: 0,
    totalReceipts: 0,
    topItem: { name: "", frequency: 0 },
  });
  const [spendingOverTime, setSpendingOverTime] = useState<Array<{ date: string; amount: number }>>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<Array<{ name: string; value: number; color: string }>>([]);

  useEffect(() => {
    setTimeout(() => {
      // Simulate fetch
      setLifestyleTags([
        { icon: "🥦", label: "Healthy Eater", description: "Frequently purchases fresh produce and organic items." },
        { icon: "🏋️‍♂️", label: "Fitness Focused", description: "Purchases health supplements and fitness-related items." },
        { icon: "🥩", label: "Meat Lover", description: "Prefers meat and seafood products." },
      ]);
      setSummaryData({
        monthSpend: 1248.50,
        totalReceipts: 24,
        topItem: { name: "Milk", frequency: 8 },
      });
      setSpendingOverTime([
        { date: "Jan 1", amount: 120 },
        { date: "Jan 5", amount: 180 },
        { date: "Jan 10", amount: 95 },
        { date: "Jan 15", amount: 220 },
        { date: "Jan 20", amount: 165 },
        { date: "Jan 25", amount: 280 },
        { date: "Jan 30", amount: 190 },
      ]);
      setCategoryBreakdown([
        { name: "Fresh Produce", value: 420, color: "#10b981" },
        { name: "Dairy", value: 180, color: "#3b82f6" },
        { name: "Meat & Seafood", value: 310, color: "#ef4444" },
        { name: "Pantry", value: 150, color: "#f59e0b" },
        { name: "Snacks", value: 90, color: "#8b5cf6" },
        { name: "Other", value: 98.50, color: "#6b7280" },
      ]);
    }, 500);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <GreetingHeader lifestyleTags={lifestyleTags} />
          <SummaryCards summaryData={summaryData}/>
          <ChartsSection spendingOverTime={spendingOverTime} categoryBreakdown={categoryBreakdown} />
          <RecentReceipts />
        </div>
      </div>
    </div>
  );
}
