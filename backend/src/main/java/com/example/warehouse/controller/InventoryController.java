package com.example.warehouse.controller;

import com.example.warehouse.dto.InventoryDTO;
import com.example.warehouse.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryController {

  @Autowired
  private InventoryService inventoryService;

  @GetMapping("/inventory")
  public List<InventoryDTO> getInventory() {
    return inventoryService.getInventory();
  }
}