import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";

export const ALL_YEARS = "All Years";
export const ALL_MONTHS = "All Months";

const months:string[] = [
  ALL_MONTHS,
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12"
];

export const RecentReceiptFilters = ({years, year, month, onYearChange, onMonthChange}: {
  years: string[];
  year: string;
  month: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
}) => {

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Filter:</span>

      <Select
        value={year}
        onValueChange={onYearChange}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((y, i) => (
            <SelectItem key={i} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={month}
        onValueChange={onMonthChange}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
