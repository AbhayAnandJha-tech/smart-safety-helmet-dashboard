import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SensorData } from "../types";

interface FilterCriteria {
  parameter: string;
  value: any;
  operator: "eq" | "gt" | "lt" | "gte" | "lte" | "contains";
}

class DataFilterService {
  private dataStream = new BehaviorSubject<SensorData[]>([]);
  private filters = new BehaviorSubject<FilterCriteria[]>([]);

  updateData(data: SensorData[]) {
    this.dataStream.next(data);
  }

  addFilter(filter: FilterCriteria) {
    const currentFilters = this.filters.value;
    this.filters.next([...currentFilters, filter]);
  }

  removeFilter(parameter: string) {
    const currentFilters = this.filters.value;
    this.filters.next(
      currentFilters.filter((f: FilterCriteria) => f.parameter !== parameter)
    );
  }

  getFilteredData(): Observable<SensorData[]> {
    return this.dataStream.pipe(map((data) => this.applyFilters(data)));
  }

  private applyFilters(data: SensorData[]): SensorData[] {
    return data.filter((item) =>
      this.filters.value.every((filter) => this.evaluateFilter(item, filter))
    );
  }

  private evaluateFilter(item: SensorData, filter: FilterCriteria): boolean {
    const value = this.getNestedValue(item, filter.parameter);

    switch (filter.operator) {
      case "eq":
        return value === filter.value;
      case "gt":
        return value > filter.value;
      case "lt":
        return value < filter.value;
      case "gte":
        return value >= filter.value;
      case "lte":
        return value <= filter.value;
      case "contains":
        return String(value)
          .toLowerCase()
          .includes(String(filter.value).toLowerCase());
      default:
        return true;
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }
}

export const dataFilterService = new DataFilterService();
