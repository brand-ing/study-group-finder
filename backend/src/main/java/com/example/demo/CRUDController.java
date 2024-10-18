package com.example.demo;

import java.util.concurrent.ExecutionException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import java.util.List;



@RestController
public class CRUDController {
    public CRUDService crudService;

    public CRUDController(CRUDService crudService) {
        this.crudService = crudService;
    }

    @PostMapping("/api/createCRUD")
    public String createCRUD(@RequestBody CRUD crud) throws InterruptedException, ExecutionException {
        return crudService.createCRUD(crud);
    }

    @GetMapping("/api/getCRUD")
    public CRUD getCRUD(@RequestParam String document_id) throws InterruptedException, ExecutionException {
        return crudService.getCRUD(document_id);
    }

    @GetMapping("/api/updateCRUD")
    public String updateCRUD(@RequestBody CRUD crud) throws InterruptedException, ExecutionException {
        return crudService.updateCRUD(crud);
    }
    
    @GetMapping("/api/deleteCRUD")
    public String deleteCRUD(@RequestParam String document_id) throws InterruptedException, ExecutionException {
        return crudService.deleteCRUD(document_id);
    }

    @GetMapping("/api/testCRUD")
    public ResponseEntity<String> testGetEndpoint() {
        return ResponseEntity.ok("Test Get Endpoint is Working");
    }

    @GetMapping("/api/getCRUDList")
    public List<CRUD> getCRUDList() throws InterruptedException, ExecutionException {
        return crudService.getCRUDList();
    }
    
}
