package com.example.warehouse.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import java.io.IOException;

public class CustomDoubleDeserializer extends StdDeserializer<Double> {

  public CustomDoubleDeserializer() {
    this(null);
  }

  public CustomDoubleDeserializer(Class<?> vc) {
    super(vc);
  }

  @Override
  public Double deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
    String value = p.getText();
    if (value == null || "N/A".equalsIgnoreCase(value.trim())) {
      return 0.0;
    }
    try {
      return Double.parseDouble(value);
    } catch (NumberFormatException e) {
      return 0.0;
    }
  }
}