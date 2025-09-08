import React, { useState } from 'react';

const AddFarm = () => {
  const [form, setForm] = useState({
    farmName: '',
    cropName: '',
    tankType: '',
    diameter: '',
    height: '',
    length: '',
    soilType: '',
    location: '',
    pincode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTankType = (type) => {
    setForm((prev) => ({
      ...prev,
      tankType: type
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add submit logic here
    alert("Farm added: " + JSON.stringify(form, null, 2));
  };

  return (
    <div className="flex items-center justify-center p-5 w-full h-full bg-[#fffcf6]">
      <form
        className="border rounded-xl p-6 md:p-8 w-[95vw] max-w-xl bg-white/90 flex flex-col gap-4 shadow focus-within:border-blue-400"
        onSubmit={handleSubmit}
      >
        {/* Farm Name */}
        <label className="text-sm">Farm Name</label>
        <input
          name="farmName"
          className="border rounded px-3 py-2 focus:outline-none focus:border-blue-400 w-full"
          placeholder="My Farm"
          value={form.farmName}
          onChange={handleChange}
        />

        {/* Crop Name */}
        <label className="text-sm mt-2">Crop Names</label>
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
          {/* etc. */}
        </select>
        <div className="flex items-center gap-8 text-sm text-gray-600 mb-1">
          <span>Rabi</span>
          <span>etc.</span>
        </div>

        {/* Water Tank Size & Type */}
        <label className="text-sm mt-2">Water Tank Size &amp; Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="tankType"
              value="circle"
              checked={form.tankType === "circle"}
              onChange={() => handleTankType("circle")}
              className="accent-blue-500"
            />
            <span>Circle</span>
          </div>
          <input
            name="diameter"
            className="border rounded px-3 py-1 w-full"
            placeholder="Width diameter (inf)"
            value={form.diameter}
            onChange={handleChange}
            disabled={form.tankType !== "circle"}
          />

          <div className="flex items-center gap-2 mt-1 sm:mt-0">
            <input
              type="radio"
              name="tankType"
              value="rectangle"
              checked={form.tankType === "rectangle"}
              onChange={() => handleTankType("rectangle")}
              className="accent-blue-500"
            />
            <span>Rectangle</span>
          </div>
          <div className="flex gap-2 w-full">
            <input
              name="height"
              className="border rounded px-3 py-1 w-1/2"
              placeholder="Width height (inf)"
              value={form.height}
              onChange={handleChange}
              disabled={form.tankType !== "rectangle"}
            />
            <input
              name="length"
              className="border rounded px-3 py-1 w-1/2"
              placeholder="Width length (inf)"
              value={form.length}
              onChange={handleChange}
              disabled={form.tankType !== "rectangle"}
            />
          </div>
        </div>

        {/* Soil Type */}
        <div className="flex gap-3 sm:gap-4 mb-1 flex-col sm:flex-row">
          <input
            name="soilType"
            className="border rounded px-3 py-2 flex-1"
            placeholder="Soil Type"
            value={form.soilType}
            onChange={handleChange}
          />
        </div>

        {/* Location & Map */}
        <label className="text-sm mt-2">Add Location of your farm</label>
        <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row mb-1">
          <input
            name="location"
            className="border rounded px-3 py-2 flex-1"
            placeholder="Select soil"
            value={form.location}
            onChange={handleChange}
          />
          <button
            type="button"
            className="bg-blue-100 px-8 py-4 rounded border text-blue-700 font-medium mt-1 sm:mt-0 w-full sm:w-auto"
          >
            Map
          </button>
        </div>

        {/* Pincode */}
        <label className="text-sm mt-2">Add Pincode</label>
        <input
          name="pincode"
          className="border rounded px-3 py-2 w-1/2 sm:w-1/3"
          placeholder="313001"
          value={form.pincode}
          onChange={handleChange}
        />

        {/* Add Farm Button */}
        <button
          type="submit"
          className="w-full mt-6 bg-blue-100 rounded py-2 hover:bg-blue-200 font-semibold text-lg border text-blue-900 transition"
        >
          Add Farm
        </button>
      </form>
    </div>
  );
};

export default AddFarm;
