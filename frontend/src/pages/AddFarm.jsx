import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarms } from '../contexts/FarmContext';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '300px' };
const center = { lat: 20.5937, lng: 78.9629 };

export default function AddFarm() {
  const navigate = useNavigate();
  const { addFarm } = useFarms();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [form, setForm] = useState({
    farmName: '',
    sizeAcres: '',
    cropName: '',
    tankType: '',
    diameter: '',
    height: '',
    length: '',
    soilType: '',
    location: '',
    pincode: '',
    coordinates: null,
    tankArea: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev, [name]: value
    }));
  };

  const handleTankType = (type) => {
    setForm(prev => ({
      ...prev,
      tankType: type,
      diameter: type === 'circle' ? '' : prev.diameter,
      height: type === 'rectangle' ? '' : prev.height,
      length: type === 'rectangle' ? '' : prev.length
    }));
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
    setForm(prev => ({
      ...prev,
      coordinates: { lat, lng },
      location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }));
  };

  // Calculate tank area live (surface area for reference)
  React.useEffect(() => {
    if (form.tankType === 'circle' && form.diameter) {
      const dia = parseFloat(form.diameter);
      if (!isNaN(dia)) setForm(f => ({
        ...f, tankArea: `${(Math.PI * (dia/2) ** 2).toFixed(1)} sq m`
      }));
    } else if (form.tankType === 'rectangle' && form.height && form.length) {
      const h = parseFloat(form.height);
      const l = parseFloat(form.length);
      if (!isNaN(h) && !isNaN(l)) setForm(f => ({
        ...f, tankArea: `${(h * l).toFixed(1)} sq m`
      }));
    } else {
      setForm(f => ({ ...f, tankArea: '' }));
    }
  }, [form.tankType, form.diameter, form.height, form.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.farmName) return alert('Farm name required');
    if (!form.sizeAcres) return alert('Farm size in acres required');
    if (!form.cropName) return alert('Select a crop');
    if (!form.tankType) return alert('Select a tank type');
    if (!form.coordinates) return alert('Please select a location on the map');
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) return alert('Pincode must be 6 digits');
    const sizeAcresNum = parseFloat(form.sizeAcres);
    if (isNaN(sizeAcresNum) || sizeAcresNum <= 0) return alert('Valid farm size in acres required');

    const newFarm = {
      name: form.farmName,
      size_acres: sizeAcresNum,
      current_crop: form.cropName,
      location: form.location,
      coordinates: form.coordinates,
      soilType: form.soilType,
      pincode: form.pincode,
      tankDetails: {
        type: form.tankType,
        dimensions: form.tankType === 'circle'
          ? { diameter: parseFloat(form.diameter) || 0 }
          : {
              length: parseFloat(form.length) || 0,
              height: parseFloat(form.height) || 0
            }
      }
      // status, lastIrrigation, soilMoisture use backend defaults
    };

    try {
      addFarm(newFarm);
      navigate('/farms');
    } catch (error) {
      console.error('Failed to add farm:', error);
      alert('Failed to add farm. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center p-5 w-full h-full bg-[#fffcf6]">
      <form className="border rounded-xl p-6 md:p-8 w-[95vw] max-w-xl bg-white/90 flex flex-col gap-4 shadow" onSubmit={handleSubmit}>
        <label className="text-sm">Farm Name</label>
        <input
          name="farmName"
          className="border rounded px-3 py-2 focus:outline-none focus:border-blue-400 w-full"
          placeholder="My Farm"
          value={form.farmName}
          onChange={handleChange}
        />

        <label className="text-sm mt-2">Farm Size (acres)</label>
        <input
          name="sizeAcres"
          type="number"
          step="0.01"
          className="border rounded px-3 py-2 focus:outline-none focus:border-blue-400 w-full"
          placeholder="e.g., 5.5"
          value={form.sizeAcres}
          onChange={handleChange}
        />

        <label className="text-sm mt-2">Crop Name</label>
        <select
          name="cropName"
          className="border rounded px-3 py-2 focus:outline-none focus:border-blue-400 w-full"
          value={form.cropName}
          onChange={handleChange}
        >
          <option value="">Select crop</option>
          <option value="Wheat">Wheat</option>
          <option value="Rice">Rice</option>
          <option value="Maize">Maize</option>
          <option value="Rabi">Rabi</option>
        </select>

        <label className="text-sm mt-2">Tank Size & Type</label>
        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="tankType"
              checked={form.tankType === "circle"}
              onChange={() => handleTankType("circle")}
            />
            Circle
          </label>
          <input
            name="diameter"
            className="border rounded px-3 py-1 w-32"
            placeholder="Diameter (m)"
            value={form.diameter}
            onChange={handleChange}
            disabled={form.tankType !== "circle"}
          />
          <label className="flex items-center gap-2 ml-6">
            <input
              type="radio"
              name="tankType"
              checked={form.tankType === "rectangle"}
              onChange={() => handleTankType("rectangle")}
            />
            Rectangle
          </label>
          <input
            name="height"
            className="border rounded px-3 py-1 w-20"
            placeholder="Height (m)"
            value={form.height}
            onChange={handleChange}
            disabled={form.tankType !== "rectangle"}
          />
          <input
            name="length"
            className="border rounded px-3 py-1 w-20"
            placeholder="Length (m)"
            value={form.length}
            onChange={handleChange}
            disabled={form.tankType !== "rectangle"}
          />
        </div>

        {form.tankType && (
          <div className="flex gap-2 items-center">
            <label className="text-sm">Tank Surface Area</label>
            <input className="w-40 px-2 border rounded" value={form.tankArea} readOnly />
          </div>
        )}

        <label className="text-sm mt-2">Soil Type</label>
        <input
          name="soilType"
          className="border rounded px-3 py-2 flex-1"
          placeholder="Soil Type"
          value={form.soilType}
          onChange={handleChange}
        />

        <label className="text-sm mt-2">Add Location</label>
        <div className="w-full h-[300px] mb-2 rounded-lg overflow-hidden border">
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={5}
              onClick={handleMapClick}
            >
              {selectedLocation && (
                <Marker position={selectedLocation} />
              )}
            </GoogleMap>
          </LoadScript>
        </div>
        <input
          name="location"
          className="border rounded px-3 py-2 flex-1"
          placeholder="Click on map to set location"
          value={form.location}
          readOnly
        />

        <label className="text-sm mt-2">Pincode</label>
        <input
          name="pincode"
          className="border rounded px-3 py-2 w-1/2 sm:w-1/3"
          placeholder="313001"
          value={form.pincode}
          onChange={handleChange}
        />

        <button type="submit" className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white rounded py-2 font-semibold text-lg transition">
          Add Farm
        </button>
      </form>
    </div>
  );
}
