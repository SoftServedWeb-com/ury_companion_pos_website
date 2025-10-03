import { useEffect, useMemo, useState } from 'react';
import { usePOSStore } from '../store/pos-store';
import MenuCard from './MenuCard';
import CategoryCard from './CategoryCard';
import SubCategoryCard from './SubCategoryCard';
import { Spinner } from './ui/spinner';
import { cn } from '../lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MenuListProps {
  onItemClick: (item: any) => void;
}

const MenuList: React.FC<MenuListProps> = ({ onItemClick }) => {
  const {
    menuItems,
    categories,
    subCategories,
    menuLoading,
    error,
    selectedCategory,
    selectedSubCategory,
    searchQuery,
    quickFilter,
    fetchMenuItems,
    setSelectedCategory,
    setSelectedSubCategory,
    isMenuInteractionDisabled,
    isOrderInteractionDisabled
  } = usePOSStore();

  const [categoriesCollapsed, setCategoriesCollapsed] = useState(false);
  const [subCategoriesCollapsed, setSubCategoriesCollapsed] = useState(false);
  const [itemsCollapsed, setItemsCollapsed] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const searchTerm = searchQuery.toLowerCase();
      const matchesCategory = !selectedCategory || item.main_category === selectedCategory;
      const matchesSubCategory = !selectedSubCategory || item.sub_category === selectedSubCategory;
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchTerm) ||
        item.item.toLowerCase().includes(searchTerm);
      const matchesFilter = quickFilter === 'all' || 
        (quickFilter === 'special' && item.special_dish === 1);
      
      return matchesCategory && matchesSubCategory && matchesSearch && matchesFilter;
    });
  }, [menuItems, selectedCategory, selectedSubCategory, searchQuery, quickFilter]);

  const isInteractionDisabled = isMenuInteractionDisabled() || isOrderInteractionDisabled();

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSubCategoryClick = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-screen-xl mx-auto p-4 pb-40 space-y-4">
        {menuLoading ? (
          <div className="h-96">
            <Spinner message="Loading menu items..." />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-red-600 text-center">
              <p className="text-lg font-medium">Error loading menu items</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Categories Row */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <button
                className="flex items-center justify-between w-full text-left mb-3"
                onClick={() => setCategoriesCollapsed(!categoriesCollapsed)}
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  Categories {selectedCategory && `(${selectedCategory})`}
                </h2>
                {categoriesCollapsed ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {!categoriesCollapsed && (
                <div className={cn(
                  "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3",
                  isInteractionDisabled && "opacity-50 pointer-events-none"
                )}>
                  {categories.map((category) => (
                    <CategoryCard
                      key={category}
                      name={category}
                      isSelected={selectedCategory === category}
                      onClick={() => handleCategoryClick(category)}
                      disabled={isInteractionDisabled}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sub Categories Row */}
            {selectedCategory && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <button
                  className="flex items-center justify-between w-full text-left mb-3"
                  onClick={() => setSubCategoriesCollapsed(!subCategoriesCollapsed)}
                >
                  <h2 className="text-lg font-semibold text-gray-900">
                    Sub Categories {selectedSubCategory && `(${selectedSubCategory})`}
                  </h2>
                  {subCategoriesCollapsed ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                {!subCategoriesCollapsed && (
                  <div className={cn(
                    "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3",
                    isInteractionDisabled && "opacity-50 pointer-events-none"
                  )}>
                    {subCategories.map((subCategory) => (
                      <SubCategoryCard
                        key={subCategory}
                        name={subCategory}
                        isSelected={selectedSubCategory === subCategory}
                        onClick={() => handleSubCategoryClick(subCategory)}
                        disabled={isInteractionDisabled}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Items Row */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <button
                className="flex items-center justify-between w-full text-left mb-3"
                onClick={() => setItemsCollapsed(!itemsCollapsed)}
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  Menu Items ({filteredItems.length})
                </h2>
                {itemsCollapsed ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {!itemsCollapsed && (
                <>
                  {filteredItems.length === 0 ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-gray-500 text-center">
                        <p className="text-lg font-medium">No items found</p>
                        <p className="text-sm mt-2">
                          {!selectedCategory 
                            ? "Select a category to view items" 
                            : !selectedSubCategory 
                            ? "Select a sub category to view items"
                            : "Try adjusting your filters or search term"
                          }
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className={cn(
                      "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3",
                      isInteractionDisabled && "opacity-50 pointer-events-none"
                    )}>
                      {filteredItems.map((item) => (
                        <MenuCard
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          price={item.price}
                          item_image={item.image}
                          course={item.course}
                          item={item.item}
                          item_category={item.main_category}
                          item_sub_category={item.sub_category}
                          onClick={() => onItemClick(item)}
                          disabled={isInteractionDisabled}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuList; 