import React, { useState } from "react";

const RoomMate = () => {
  const [formData, setFormData] = useState({
    sleepSchedule: "",
    noiseLevel: "",
    cleanliness: "",
    smoking: "",
    pets: "",
    guests: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Preferences:", formData);
    // You can now send this data to the backend
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 rounded-xl shadow-lg max-w-md mx-auto space-y-4 bg-white"
    >
      <h2 className="text-xl font-bold mb-4 text-center">
        Your Living Preferences
      </h2>

      <div>
        <label className="block font-medium">Sleep Schedule</label>
        <select
          name="sleepSchedule"
          value={formData.sleepSchedule}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select</option>
          <option value="early">Early (10pm - 7am)</option>
          <option value="normal">Normal (11pm - 8am)</option>
          <option value="late">Late (After Midnight)</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Noise Level Tolerance</label>
        <select
          name="noiseLevel"
          value={formData.noiseLevel}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select</option>
          <option value="quiet">Prefer quiet environment</option>
          <option value="moderate">Moderate noise is okay</option>
          <option value="noisy">I’m okay with noise</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Cleanliness</label>
        <select
          name="cleanliness"
          value={formData.cleanliness}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select</option>
          <option value="neat">Very neat and tidy</option>
          <option value="average">Average cleanliness</option>
          <option value="messy">I'm a bit messy</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Do you smoke?</label>
        <select
          name="smoking"
          value={formData.smoking}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select</option>
          <option value="no">No</option>
          <option value="occasionally">Occasionally</option>
          <option value="yes">Yes</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Are you okay with pets?</label>
        <select
          name="pets"
          value={formData.pets}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="allergic">I'm allergic</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Do you allow guests over?</label>
        <select
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select</option>
          <option value="never">Never</option>
          <option value="sometimes">Sometimes</option>
          <option value="often">Often</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Save Preferences
      </button>
    </form>
  );
};

export default RoomMate;
