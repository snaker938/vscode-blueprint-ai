import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './EditingInterface.css';

const EditingInterface: React.FC = () => {
  return (
    <div className="editing-interface">
      <Sidebar />
      <div className="main-content">
        {/* Add your canvas or other components here */}
      </div>
    </div>
  );
};

export default EditingInterface;
