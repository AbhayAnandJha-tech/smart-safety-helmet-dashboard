import { database } from "../firebase";
import { ref, get, push } from "firebase/database";
import { DataExportService } from "./DataExportService";

interface ReportSchedule {
  id: string;
  frequency: "daily" | "weekly" | "monthly";
  recipients: string[];
  lastRun: number;
  nextRun: number;
}

export class ReportingService {
  private schedulesRef = ref(database, "reportSchedules");
  private exportService = new DataExportService();

  async scheduleReport(
    schedule: Omit<ReportSchedule, "id" | "lastRun" | "nextRun">
  ) {
    const now = Date.now();
    const nextRun = this.calculateNextRun(now, schedule.frequency);

    await push(this.schedulesRef, {
      ...schedule,
      lastRun: now,
      nextRun,
    });
  }

  private calculateNextRun(
    currentTime: number,
    frequency: ReportSchedule["frequency"]
  ): number {
    const oneDay = 24 * 60 * 60 * 1000;
    switch (frequency) {
      case "daily":
        return currentTime + oneDay;
      case "weekly":
        return currentTime + 7 * oneDay;
      case "monthly":
        return currentTime + 30 * oneDay;
      default:
        return currentTime + oneDay;
    }
  }
}

export const reportingService = new ReportingService();
