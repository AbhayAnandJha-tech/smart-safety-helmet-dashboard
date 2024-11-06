import { SensorData } from "../types";

export class DataValidationService {
  private VALID_RANGES = {
    temperature: { min: -10, max: 50 },
    humidity: { min: 0, max: 100 },
    gasLevel: { min: 0, max: 100 },
    oxygenLevel: { min: 0, max: 100 },
    heartRate: { min: 30, max: 200 },
  };

  validateSensorData(data: SensorData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate temperature
    if (
      !this.isInRange(data.readings.temperature, this.VALID_RANGES.temperature)
    ) {
      errors.push(`Invalid temperature: ${data.readings.temperature}`);
    }

    // Continue with other validations using data.readings...
    // ... rest of the validations

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private isInRange(
    value: number,
    range: { min: number; max: number }
  ): boolean {
    return value >= range.min && value <= range.max;
  }
}
