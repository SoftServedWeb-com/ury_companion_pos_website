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
  const [keyboardInputValue, setKeyboardInputValue] = useState<string>('');
  const keyboardRef = useRef<any>(null);

  const openKeyboard = (inputId: string, currentValue: string, onChange: (value: string) => void) => {
    console.log('KeyboardContext: openKeyboard called with:', { inputId, currentValue });
    setActiveInput(inputId);
    setCurrentOnChange(() => onChange);
    setKeyboardInputValue(currentValue);
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
    // Apply the final value to the original input field
    if (currentOnChange && keyboardInputValue !== undefined) {
      currentOnChange(keyboardInputValue);
    }
    setIsKeyboardOpen(false);
    setActiveInput(null);
    setCurrentOnChange(null);
    setKeyboardInputValue('');
  };

  const updateKeyboardValue = (value: string) => {
    setKeyboardInputValue(value);
    // Also update the original input in real-time for preview
    if (currentOnChange) {
      currentOnChange(value);
    }
  };

  const handleKeyboardChange = (input: string) => {
    updateKeyboardValue(input);
  };

  // Debug keyboard state changes
  React.useEffect(() => {
    console.log('KeyboardContext: isKeyboardOpen changed to:', isKeyboardOpen);
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
      
      {/* Backdrop overlay with blur and dark background */}
      {isKeyboardOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              closeKeyboard();
            }}
            onMouseDown={(e) => {
              // Stop propagation at mousedown to prevent other dialogs from closing
              e.stopPropagation();
            }}
            onMouseUp={(e) => {
              // Also stop propagation on mouseup
              e.stopPropagation();
            }}
          />
          
          {/* Keyboard container with input field */}
          <div 
            className="fixed bottom-0 left-0 right-0 z-[9999] virtual-keyboard-container"
            onClick={(e) => {
              // Prevent clicks on keyboard from bubbling to backdrop
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              // Prevent mousedown on keyboard from bubbling
              e.stopPropagation();
            }}
          >
            <div className="bg-white border-t border-gray-200 shadow-2xl">
              {/* Input field above keyboard */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">Enter text:</span>
                  <button
                    onClick={closeKeyboard}
                    className="ml-auto text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors"
                    aria-label="Close keyboard"
                  >
                    ×
                  </button>
                </div>
                <input
                  type="text"
                  value={keyboardInputValue}
                  readOnly
                  className="keyboard-input-field w-full px-4 py-3 text-lg border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type using the keyboard below..."
                />
              </div>
              
              {/* Keyboard */}
              <div className="p-4 bg-gray-50">
                <KeyboardWrapper 
                  keyboardRef={keyboardRef} 
                  onChange={handleKeyboardChange} 
                />
              </div>
            </div>
          </div>
        </>
      )}
    </KeyboardContext.Provider>
  );
};
