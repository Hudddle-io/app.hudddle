import { Bold, Italic, Underline } from "lucide-react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface FilterCategoryProps {
  onCategoryChange: (categories: string[]) => void;
  selectedCategories: string[];
}

const filterItem = [
  "Urgent",
  "High",
  "Medium",
  "Low",
]
const FilterCategory: React.FC<FilterCategoryProps> = ({ onCategoryChange, selectedCategories }) => {
  const [internalSelectedCategories, setInternalSelectedCategories] = useState<string[]>(selectedCategories);

  useEffect(() => {
    onCategoryChange(internalSelectedCategories);
  }, [internalSelectedCategories, onCategoryChange]);

  const toggleFilter = (category: string) => {
    setInternalSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="w-[2/3] mr-24">
      <div className="grid grid-cols-3 gap-4">
        {filterItem.map((category) => (
          <button
            key={category}
            onClick={() => toggleFilter(category)}
            className={`px-4 py-2 rounded-full border text-sm transition-all
              ${
                internalSelectedCategories.includes(category)
                  ? "bg-purple-600 text-white"
                  : "border-gray-400 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterCategory;