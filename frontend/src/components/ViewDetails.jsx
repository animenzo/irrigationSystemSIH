import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFarms } from '../contexts/FarmContext';
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '220px' };

// Helper for crop image
function getCropImg(crop) {
  return `/assets/crops/${(crop?.toLowerCase() || 'default')}.png`;
}

export default function ViewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { farms } = useFarms();
  const farm = farms.find(f => String(f.id) === String(id));

  if (!farm) return (
    <div className="p-10 flex flex-col items-center text-gray-500">
      <span className="mb-6">Farm not found.</span>
      <button onClick={() => navigate(-1)} className="text-green-700 underline"><ArrowLeft />Go Back</button>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="text-blue-500 flex items-center mb-4 hover:underline">
        <ArrowLeft className="mr-1" /> Farms Management
      </button>
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="flex items-center space-x-5 mb-3">
          <img src={getCropImg(farm.crop)} 
               onError={e => (e.target.src = "/assets/crops/default.png")}
               alt={farm.crop} className="h-12 w-12 object-contain rounded border border-green-200 bg-green-50" />
          <div>
            <div className="text-2xl font-bold mb-0.5">{farm.name}</div>
            <span className="text-gray-500 flex items-center gap-2 text-sm"><MapPin className="w-3 h-3" />{farm.location}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div><span className="font-semibold">Crop:</span> {farm.crop}</div>
          <div><span className="font-semibold">Area:</span> {farm.area}</div>
          <div><span className="font-semibold">Soil Type:</span> {farm.soilType || '-'}</div>
          <div><span className="font-semibold">Pincode:</span> {farm.pincode || '-'}</div>
        </div>
        <div>
          <span className="font-semibold block mb-1">Tank Details:</span>
          <div className="bg-gray-50 p-2 rounded text-sm text-gray-600">
            Type: <b>{farm.tankDetails.type?.toUpperCase()}</b> <br/>
            {farm.tankDetails.type === "circle" ? (
              <>Diameter: <b>{farm.tankDetails.diameter} m</b></>
            ) : (
              <>
                Height: <b>{farm.tankDetails.height} m</b><br />
                Length: <b>{farm.tankDetails.length} m</b>
              </>
            )}
          </div>
        </div>
        <div>
          <span className="font-semibold block mb-1">Last Irrigation:</span>
          <span className="flex items-center gap-2 text-gray-500">
            <Calendar className="w-4 h-4" />
            {farm.lastIrrigation || 'Never'}
          </span>
        </div>
        <div>
          <span className="font-semibold block mb-1">Soil Moisture:</span>
          <div className="flex items-center gap-3">
            <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
              <div className={`h-2 rounded-full ${farm.soilMoisture < 30 ? "bg-red-500" : "bg-green-500"}`}
                style={{ width: `${farm.soilMoisture ?? 0}%` }} />
            </div>
            <span className={farm.soilMoisture < 30 ? 'text-red-600 font-bold' : 'text-green-700 font-bold'}>
              {farm.soilMoisture ?? 0}%
            </span>
            {farm.soilMoisture < 30 && (
              <span className="text-xs text-red-400 ml-2">Low – Water needed</span>
            )}
          </div>
        </div>
        {!!farm.coordinates && (
          <div>
            <span className="font-semibold block mb-1">Location Map</span>
            <div className="rounded-lg overflow-hidden border w-full h-[220px]">
              <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={farm.coordinates}
                  zoom={15}
                >
                  <Marker position={farm.coordinates} />
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
