// FileUploadComponent.js
import React from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "./firebaseConfig";

const FileUploadComponent = ({ groupId, userId, pushNotification }) => {
    const handleFileUpload = async () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "application/pdf,image/*";

        fileInput.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            try {
                // Firebase Storage Reference
                const storageRef = ref(storage, `uploads/${groupId}/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
                console.log("Upload Path:", `uploads/${groupId}/${file.name}`);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log("Upload is " + progress + "% done");
                    },
                    (error) => {
                        console.error("Upload failed:", error);
                        alert("File upload failed.");
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log("File available at", downloadURL);

                        // Save Metadata to Firestore
                        const uploadsCollectionRef = collection(
                            db,
                            "Groups",
                            groupId,
                            "uploads"
                        );

                        await addDoc(uploadsCollectionRef, {
                            url: downloadURL,
                            name: file.name,
                            uploadedBy: userId,
                            uploadedAt: serverTimestamp(),
                        });

                        // Push File Upload Notification
                        pushNotification({
                            type: "FILES",
                            message: `${file.name} uploaded successfully.`,
                            link: downloadURL,
                        });

                        alert("File uploaded successfully!");
                    }
                );
            } catch (error) {
                console.error("Error uploading file:", error);
                alert("File upload failed.");
            }
        };

        fileInput.click();
    };

    return (
        <div className="file-upload-container">
            <h2>File Upload</h2>
            <button className="upload-btn" onClick={handleFileUpload}>
                Upload File
            </button>
        </div>
    );
};

export default FileUploadComponent;
