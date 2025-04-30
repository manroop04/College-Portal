import React, { useState } from "react";
import { LostItem, FoundItem } from "../../types/index"; 
import "../../styles/ItemForm.css";

type Props = {
  type: "lost" | "found";
  onSubmit: (item: LostItem | FoundItem) => void;
};

const ItemForm: React.FC<Props> = ({ type, onSubmit }) => {
  const [form, setForm] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setForm({ ...form, image: imageUrl });
    }
  };

  const handleSubmit = () => {
    const item = {
      ...form,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
    };
    onSubmit(item);
  };

  return (
    <form className="form-container" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <h2 className="form-title">
        {type === "lost" ? "Report Lost Item" : "Report Found Item"}
      </h2>
      <input
        className="form-input"
        type="text"
        name="category"
        placeholder="Category"
        onChange={handleChange}
        required
      />
      <input
        className="form-input"
        type="text"
        name="name"
        placeholder="Product Name"
        onChange={handleChange}
        required
      />

      {type === "lost" ? (
        <>
          <input
            className="form-input"
            name="owner"
            type="text"
            placeholder="Owner Name"
            onChange={handleChange}
            required
          />
          <input
            className="form-input"
            name="location"
            type="text"
            placeholder="Last Location"
            onChange={handleChange}
            required
          />
        </>
      ) : (
        <>
          <input
            className="form-input"
            name="foundBy"
            type="text"
            placeholder="Found By"
            onChange={handleChange}
            required
          />
          <input
            className="form-input"
            name="foundLocation"
            type="text"
            placeholder="Found Location"
            onChange={handleChange}
            required
          />
        </>
      )}

      <input
        className="form-input"
        name="enrollment"
        type="text"
        placeholder="Enrollment No"
        onChange={handleChange}
        required
      />
      <input
        className="form-input"
        name="contact"
        placeholder="Contact No"
        onChange={handleChange}
        required
      />
      <input
        className="form-input"
        name="email"
        type="email"
        placeholder="Email id"
        onChange={handleChange}
        required
      />
      <input
        className="form-input"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        required
      />

      <button className="form-button" type="submit">
        Submit
      </button>
    </form>
  );
};

export default ItemForm;