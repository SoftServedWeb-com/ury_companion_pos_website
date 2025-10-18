import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import KeyboardWrapper from '../components/KeyboardWrapper';

/**
 * KeyboardContext provides global virtual keyboard functionality
 * 
 * Usage in components:
 * 1. Import: import { useKeyboard } from '../contexts/KeyboardContext';
 * 2. Get hook: const { openKeyboard } = useKeyboard();
 * 3. Add to input: onFocus={() => openKeyboard('uniqueId', currentValue, onChangeFunction)}
 * 
 * The keyboard will appear at the bottom of the screen when an input is focused
 * and will close when clicking outside or pressing the close button.
 */
interface KeyboardContextType {
  isKeyboardOpen: boolean;
  activeInput: string | null;
  keyboardRef: React.RefObject<any>;
  openKeyboard: (inputId: string, currentValue: string, onChange: (value: string) => void) => void;
  closeKeyboard: () => void;
  updateKeyboardValue: (value: string) => void;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined);

export const useKeyboard = () => {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error('useKeyboard must be used within a KeyboardProvider');
  }
  return context;
};

interface KeyboardProviderProps {
  children: ReactNode;
}

export const KeyboardProvider: React.FC<KeyboardProviderProps> = ({ children }) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [currentOnChange, setCurrentOnChange] = useState<((value: string) => void) | null>(null);
  const keyboardRef = useRef<any>(null);

  const openKeyboard = (inputId: string, currentValue: string, onChange: (value: string) => void) => {
    console.log('KeyboardContext: openKeyboard called with:', { inputId, currentValue });
    setActiveInput(inputId);
    setCurrentOnChange(() => onChange);
    setIsKeyboardOpen(true);
    
    // Set the current value in the keyboard
    setTimeout(() => {
      if (keyboardRef.current && keyboardRef.current.setInput) {
        keyboardRef.current.setInput(currentValue);
      }
    }, 100);
  };

  const closeKeyboard = () => {
    console.log('KeyboardContext: closeKeyboard called');
    setIsKeyboardOpen(false);
    setActiveInput(null);
    setCurrentOnChange(null);
  };

  const updateKeyboardValue = (value: string) => {
    if (currentOnChange) {
      currentOnChange(value);
    }
  };

  const handleKeyboardChange = (input: string) => {
    updateKeyboardValue(input);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    // Check if click is outside the keyboard and not on any input that should keep keyboard open
    if (isKeyboardOpen && !target.closest('.virtual-keyboard-container') && !target.closest('input')) {
      closeKeyboard();
    }
  };

  // Debug keyboard state changes
  React.useEffect(() => {
    console.log('KeyboardContext: isKeyboardOpen changed to:', isKeyboardOpen);
  }, [isKeyboardOpen]);

  // Add click outside listener when keyboard is open
  React.useEffect(() => {
    if (isKeyboardOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isKeyboardOpen]);

  return (
    <KeyboardContext.Provider
      value={{
        isKeyboardOpen,
        activeInput,
        keyboardRef,
        openKeyboard,
        closeKeyboard,
        updateKeyboardValue,
      }}
    >
      {children}
      
      {/* Absolutely positioned keyboard */}
      {isKeyboardOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg virtual-keyboard-container">
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Virtual Keyboard</span>
              <button
                onClick={closeKeyboard}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ×
              </button>
            </div>
            <KeyboardWrapper 
              keyboardRef={keyboardRef} 
              onChange={handleKeyboardChange} 
            />
          </div>
        </div>
      )}
    </KeyboardContext.Provider>
  );
};
