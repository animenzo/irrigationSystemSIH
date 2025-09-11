import React from 'react';
import { Plus, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFarms } from '../contexts/FarmContext';
// Assume you have farm images in public/assets/crops or any static hosting

function StatusBadge({ status }) {

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        status === "Active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}

const getCropImg = (crop) =>
  `/assets/crops/${crop?.toLowerCase().replace(/\s+/g, '') || 'default'}.png`;

export default function Farms() {
  const { farms, loading, error } = useFarms(); // Use context, not static array
  const navigate = useNavigate();

  return (
   <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Farms Management</h1>
          <p className="text-gray-500">Monitor and manage your agricultural fields</p>
        </div>
        <button
          onClick={() => navigate("/addfarm")}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Farm
        </button>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            No farms added yet. Click "Add New Farm" to get started.
          </div>
        ) : (
          farms.map(farm => (
            <div 
              key={farm._id}
              onClick={() => navigate(`/dashboard/${farm._id}`)}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{farm.name}</h2>
                <StatusBadge status="Active" />
              </div>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {farm.location || 'Location not set'}
                </p>
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {farm.current_crop}
                </p>
                  <p className="text-sm text-gray-500">
                  {farm.size_acres} Acres
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
  
}
