package com.example.demo;

import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import java.util.List;
import java.util.ArrayList;

@Service
public class CRUDService {
    
    public String createCRUD(CRUD crud) throws ExecutionException, InterruptedException{
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = db.collection("crud_user")
            .document(crud.getName()).set(crud);
        return collectionsApiFuture.get().getUpdateTime().toString();
    }

    public String updateCRUD(CRUD crud) {
        return "";
    }

    public String deleteCRUD(String documentID) throws ExecutionException, InterruptedException{
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> writeResult = db.collection("crud_user").document(documentID).delete();
        String time = writeResult.get().getUpdateTime().toString();
        return "Successfully deleted " + documentID + " at " + time;
    }
    
    public CRUD getCRUD(String documentID) throws ExecutionException, InterruptedException{
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference documentReference = db.collection("crud_user").document(documentID);

        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();

        CRUD crud;
        if(document.exists()) {
            crud = document.toObject(CRUD.class);
            return crud;
        }
        return null;
    }

    public List<CRUD> getCRUDList() throws ExecutionException, InterruptedException{
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference collectionReference = db.collection("crud_user");
        // ApiFuture<DocumentReference> documentList = collectionReference.get()
        ApiFuture<QuerySnapshot> future = collectionReference.get();
        QuerySnapshot query = future.get();
        List<QueryDocumentSnapshot> documentList = query.getDocuments();

        List<CRUD> CRUDList = new ArrayList<CRUD>();

        for(QueryDocumentSnapshot document :documentList){
            CRUDList.add(document.toObject(CRUD.class));
        }
        return CRUDList;

    };
}


