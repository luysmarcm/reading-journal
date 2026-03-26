"use client";
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Library, 
  Image as ImageIcon, 
  BookOpen, 
  Users, 
  BarChart3, 
  BookMarked,
  Plus
} from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('Library');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Library', icon: Library, href: '/library' },
    { name: 'Gallery', icon: ImageIcon, href: '/gallery' },
    { name: 'Reading Diary', icon: BookOpen, href: '/reading-diary' },
    { name: 'Authors', icon: Users, href: '/authors' },
    { name: 'Statistics', icon: BarChart3, href: '/statistics' },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-[#FDF5F0] border-r border-gray-100 p-6 font-serif">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="p-2 bg-[#6B4F4F] rounded-md text-white">
          <BookMarked size={20} />
        </div>
        <h1 className="text-xl font-semibold text-[#4A3F3F]">Reading Journal</h1>
      </div>

      <hr className="border-t border-dashed border-gray-300 mb-8" />

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          
          return (
            <Link
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-[#F5D5D9] text-[#4A3F3F]' 
                  : 'text-gray-500 hover:bg-[#FCEAEB] hover:text-[#4A3F3F]'
                }`}
              href={item.href}

            >
              <Icon 
                size={20} 
                className={`${isActive ? 'text-[#4A3F3F]' : 'text-gray-400 group-hover:text-[#4A3F3F]'}`} 
              />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Button */}
      <div className="mt-auto">
        <button  className="w-full bg-[#F5D5D9] hover:bg-[#EBC2C7] text-[#4A3F3F] py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
          <Plus size={18} />
          <a href="/new" className="text-sm font-medium">
            Add Book
          </a>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;