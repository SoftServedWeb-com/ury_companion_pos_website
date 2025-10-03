import { FC } from 'react';
import { cn } from '../lib/utils';

interface SubCategoryCardProps {
  name: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const SubCategoryCard: FC<SubCategoryCardProps> = ({ 
  name, 
  isSelected, 
  onClick, 
  disabled 
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer h-16 flex items-center justify-center border-2",
        isSelected 
          ? "border-green-500 bg-green-50" 
          : "border-gray-200 hover:border-gray-300",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
      onClick={disabled ? undefined : onClick}
    >
      <div className="text-center px-3">
        <h3 className={cn(
          "font-medium text-xs leading-4",
          isSelected ? "text-green-700" : "text-gray-900"
        )}>
          {name}
        </h3>
      </div>
    </div>
  );
};

export default SubCategoryCard;