'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (value: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('');
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (value.length >= 2 || value.length === 0) {
      timerRef.current = setTimeout(() => {
        onSearch(value);
      }, 300); // 300ms delay
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="flex-1"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search items..."
        className="p-2 bg-white/5 rounded-md border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner w-full"
      />
    </motion.form>
  );
}