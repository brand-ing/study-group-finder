package com.example.demo;
import java.io.FileInputStream;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;


import com.google.auth.oauth2.GoogleCredentials;
// import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
// import com.google.firebase.cloud.FirestoreClient;

import jakarta.annotation.PostConstruct;


@SpringBootApplication
@RestController
public class DemoApplication {
    private static final String SECRETFILE = "serviceAccountKey.json";
    private static final String SECRETDIRVAR = "SECRET_LOCATION";

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    

    @PostConstruct
    public void initialize() {
        String secretLocation = System.getenv(SECRETDIRVAR); //it is expected that the env var will point to a location on the file system.
                                                             //it should begin and end with '/' 
        if (secretLocation == null) {
            System.err.println("FATAL ERROR: SECRET_LOCATION environment variable not set.");
            return;
        }
        try {
        FileInputStream serviceAccount = new FileInputStream(secretLocation.concat(SECRETFILE));
        FirebaseOptions options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .build();

        FirebaseApp.initializeApp(options);


        } catch (Exception e) {
            System.out.println("FATAL ERROR: Firebase connection could not be initialized or file handling issue.");
            e.printStackTrace();
        }
        // Firestore db = FirestoreClient.getFirestore();
        System.out.println("Firebase connection test success!");

    }
}