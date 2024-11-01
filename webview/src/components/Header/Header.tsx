import React from 'react';
import SketchButton from './SketchButton';
import TextButton from './TextButton';
import ScratchButton from './ScratchButton';
import './Header.css'; // Optional: styles for the header

const Header: React.FC = () => {
  return (
    <div className="header">
      <SketchButton />
      <TextButton />
      <ScratchButton />
    </div>
  );
};

export default Header;
