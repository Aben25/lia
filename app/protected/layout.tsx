// Sidebar.tsx
import React from 'react';

interface SidebarProps {
  className?: string; // Allow className to be passed
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return <div className={`sidebar ${className}`}>Sidebar Content</div>;
};

export default Sidebar;
