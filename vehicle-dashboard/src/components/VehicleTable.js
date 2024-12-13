// src/components/VehicleTable.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VehicleTable.css';

const VehicleTable = () => {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({ name: '', status: '' });
  const [loading, setLoading] = useState(false);

  // Fetch vehicles from the backend
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/vehicles')  // Correct the URL
      .then(response => {
        setVehicles(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching vehicles!', error);
        setLoading(false);
      });
  }, []);  // Empty dependency array, so it only runs once when the component mounts.
   // This will refetch the data whenever the vehicle state changes.

  // Handle adding a new vehicle
  const handleAddVehicle = () => {
    if (newVehicle.name && newVehicle.status) {
      axios.post('http://localhost:5000/vehicles', newVehicle)
        .then(response => {
          setVehicles([...vehicles, response.data]);
          setNewVehicle({ name: '', status: '' });
        })
        .catch(error => {
          console.error('There was an error adding the vehicle!', error);
        });
    } else {
      alert("Please fill in both fields!");
    }
  };

  // Handle status update
  const handleUpdateStatus = (id, status) => {
    axios.put(`http://localhost:5000/vehicles/${id}`, { status })
      .then(response => {
        setVehicles(vehicles.map(vehicle => vehicle._id === id ? response.data : vehicle));
      })
      .catch(error => {
        console.error('There was an error updating the status!', error);
      });
  };

  return (
    <div className="vehicle-table-container">
      <h1>Vehicle Management Dashboard</h1>

      {/* New Vehicle Form */}
      <div className="add-vehicle-form">
        <input
          type="text"
          placeholder="Vehicle Name"
          value={newVehicle.name}
          onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Status"
          value={newVehicle.status}
          onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}
          className="input-field"
        />
        <button onClick={handleAddVehicle} className="add-button">Add Vehicle</button>
      </div>

      {/* Loading Indicator */}
      {loading && <div className="loading">Loading vehicles...</div>}

      {/* Vehicle Table */}
      {!loading && (
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Vehicle Name</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle._id}>
                <td>{vehicle.name}</td>
                <td>{vehicle.status}</td>
                <td>{new Date(vehicle.lastUpdated).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleUpdateStatus(vehicle._id, 'Active')}
                    className="status-button active-button"
                  >
                    Set Active
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(vehicle._id, 'Inactive')}
                    className="status-button inactive-button"
                  >
                    Set Inactive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VehicleTable;
