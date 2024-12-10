import { db, storage } from "./firebaseConfig"; // Ensure Firebase is configured
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Updated File Upload Handler
export const handleFileUpload = async (groupId, userId, pushNotification) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/pdf,image/*";

    fileInput.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            // Create File Storage Reference
            const storageRef = ref(storage, `uploads/${groupId}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

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
                    // Get Download URL After Upload
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
                        label: "FILES",
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
