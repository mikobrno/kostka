import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CopyButton } from './CopyButton';
import { MapPin } from 'lucide-react';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AddressInput: React.FC<AddressInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Zadejte adresu",
  className = ''
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Získání API klíče z proměnných prostředí Vite
  const MAPY_CZ_API_KEY = import.meta.env.VITE_MAPY_CZ_API_KEY;

  const searchAddresses = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    if (!MAPY_CZ_API_KEY) {
      console.error('Missing Mapy.cz API key. Please add VITE_MAPY_CZ_API_KEY to your .env file.');
      return;
    }

    setLoading(true);
    try {
      // Volání Mapy.cz Fulltext Search API
      // Dokumentace: https://api.mapy.cz/doc/api/fulltextsearch/
      const response = await fetch(
  `https://api.mapy.cz/suggest/?query=${encodeURIComponent(query)}&apiKey=${MAPY_CZ_API_KEY}&type=addr`
);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Zpracování dat a extrakce adres
      if (data && data.data && Array.isArray(data.data)) {
        const newSuggestions = data.data.map((item: any) => item.name || item.label);
        setSuggestions(newSuggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Chyba při načítání adres z Mapy.cz API:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [MAPY_CZ_API_KEY]); // Závislost na API klíči

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value) {
        searchAddresses(value);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value, searchAddresses]); // Přidáno searchAddresses do závislostí

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    setShowSuggestions(true);
  };

  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <div className="flex">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className={`block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
            placeholder={placeholder}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
          )}
        </div>
        <CopyButton text={value} />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onMouseDown={(e) => { // Použito onMouseDown pro zamezení blur události před kliknutím
                e.preventDefault(); 
                selectSuggestion(suggestion);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors first:rounded-t-md last:rounded-b-md"
            >
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};