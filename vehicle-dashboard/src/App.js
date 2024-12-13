import React from 'react';
import './App.css';
import VehicleTable from './components/VehicleTable';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Vehicle Management Dashboard</h1>
        <p className="app-description">

        </p>
      </header>

      <div className="table-container">
        <VehicleTable />
      </div>
    </div>
  );
}

export default App;
