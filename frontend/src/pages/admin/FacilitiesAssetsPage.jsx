import React, { useState } from 'react';
import ResourceListPage from '../resources/ResourceListPage';
import ResourceModal from '../resources/components/ResourceModal';
import './FacilitiesAssetsPage.css';

export default function FacilitiesAssetsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="facilities-assets-wrapper">
      <header className="page-header">
        <div className="header-text">
          <h1>Manage Facilities & Assets</h1>
          <p>Add, edit, or remove campus resources and equipment.</p>
        </div>
        <button 
          className="btn-add-resource"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="plus-icon">+</span>
          New Resource
        </button>
      </header>

      <div className="content-area">
        <ResourceListPage refreshTrigger={refreshTrigger} hideHeader={true} />
      </div>

      <ResourceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
        mode="CREATE"
      />
    </div>
  );
}
