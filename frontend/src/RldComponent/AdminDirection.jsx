// src/RldComponent/AdminDirection.jsx
import React, { useState } from "react";
import axios from "axios";
import DirectionDragDrop from "./DirectionDragDrop";

export default function AdminDirection() {
  const [easyImage, setEasyImage] = useState(null);
  const [mediumImage, setMediumImage] = useState(null);
  const [hardImage, setHardImage] = useState(null);

  const [easyQuestion, setEasyQuestion] = useState("");
  const [mediumQuestion, setMediumQuestion] = useState("");
  const [hardQuestion, setHardQuestion] = useState("");

  const [easyItems, setEasyItems] = useState([
    { id: "1", name: "Tree", assignedDirection: null },
    { id: "2", name: "House", assignedDirection: null },
  ]);
  const [mediumItems, setMediumItems] = useState([
    { id: "3", name: "Car", assignedDirection: null },
    { id: "4", name: "Dog", assignedDirection: null },
  ]);
  const [hardItems, setHardItems] = useState([
    { id: "5", name: "Bicycle", assignedDirection: null },
    { id: "6", name: "Cat", assignedDirection: null },
  ]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("easy_image", easyImage);
    formData.append("medium_image", mediumImage);
    formData.append("hard_image", hardImage);
    formData.append("easy_question", easyQuestion);
    formData.append("medium_question", mediumQuestion);
    formData.append("hard_question", hardQuestion);
    formData.append("easy_items", JSON.stringify(easyItems));
    formData.append("medium_items", JSON.stringify(mediumItems));
    formData.append("hard_items", JSON.stringify(hardItems));

    try {
      await axios.post(
        "http://localhost:5000/rld/add_direction_set",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      alert("Direction set uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Error uploading direction set");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload RLD Direction Set</h1>

      {[
        [
          "easy",
          easyImage,
          setEasyImage,
          easyQuestion,
          setEasyQuestion,
          easyItems,
          setEasyItems,
        ],
        [
          "medium",
          mediumImage,
          setMediumImage,
          mediumQuestion,
          setMediumQuestion,
          mediumItems,
          setMediumItems,
        ],
        [
          "hard",
          hardImage,
          setHardImage,
          hardQuestion,
          setHardQuestion,
          hardItems,
          setHardItems,
        ],
      ].map(
        ([level, image, setImage, question, setQuestion, items, setItems]) => (
          <div key={level} className="mb-6">
            <label className="block mb-1 capitalize">{level} level image</label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            <label className="block mt-2">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="border p-2 w-full"
            />
            <DirectionDragDrop items={items} setItems={setItems} />
          </div>
        ),
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload Direction Set
      </button>
    </div>
  );
}
