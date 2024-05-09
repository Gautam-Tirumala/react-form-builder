import React from "react";

function FileUploadInput({ field, formData, handleChange, errors }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const blobData = new Blob([event.target.result], { type: file.type });
            handleChange(blobData, field);
        };
        reader.readAsArrayBuffer(file);
    }
};

  return (
    <div className="">
      <input
        type="file"
        className="w-full px-4 border rounded-md focus:outline-none focus:border-blue-500"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default FileUploadInput;
