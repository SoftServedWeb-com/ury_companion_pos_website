import { FC } from 'react';
import { cn } from '../lib/utils';

interface CategoryCardProps {
  name: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const CategoryCard: FC<CategoryCardProps> = ({ 
  name, 
  isSelected, 
  onClick, 
  disabled 
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer h-20 flex items-center justify-center border-2",
        isSelected 
          ? "border-blue-500 bg-blue-50" 
          : "border-gray-200 hover:border-gray-300",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
      onClick={disabled ? undefined : onClick}
    >
      <div className="text-center px-4">
        <h3 className={cn(
          "font-medium text-sm leading-5",
          isSelected ? "text-blue-700" : "text-gray-900"
        )}>
          {name}
        </h3>
      </div>
    </div>
  );
};

export default CategoryCard;