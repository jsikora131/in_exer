import { PackageTableRecord } from "../models/package-table-record";
import { PricingTableRecord } from "../models/pricing-table-record";
import { Service } from "../domain/service";

export class DataHelper {
    public static getServices() : Service[] {
        const photographyService = new Service("Photography", null, [
            new PricingTableRecord(2020, 1700),
            new PricingTableRecord(2021, 1800),
            new PricingTableRecord(2022, 1900),
        ]);
        const videoRecordingService = new Service("VideoRecording", null, [
            new PricingTableRecord(2020, 1700),
            new PricingTableRecord(2021, 1800),
            new PricingTableRecord(2022, 1900),
        ]);
        const blurayPackageService = new Service("BlurayPackage", [videoRecordingService.type]);
        const weddingSessionService = new Service("WeddingSession", null, [
            new PricingTableRecord(2020, 600),
            new PricingTableRecord(2021, 600),
            new PricingTableRecord(2022, 600),
        ]);
        const twoDayEventService = new Service("TwoDayEvent", [weddingSessionService.type, photographyService.type]);

        return [
            photographyService,
            videoRecordingService,
            blurayPackageService,
            twoDayEventService,
            weddingSessionService
        ];
    }

    public static getPackages() : PackageTableRecord[] {
        return [
            new PackageTableRecord(2020, 2000, ["Photography", "WeddingSession"]),
            new PackageTableRecord(2021, 2100, ["Photography", "WeddingSession"]),
            new PackageTableRecord(2022, 1900, ["Photography", "WeddingSession"]),
            new PackageTableRecord(2020, 2000, ["VideoRecording", "WeddingSession"]),
            new PackageTableRecord(2021, 2100, ["VideoRecording", "WeddingSession"]),
            new PackageTableRecord(2022, 2200, ["VideoRecording", "WeddingSession"]),
            new PackageTableRecord(2020, 2200, ["VideoRecording", "Photography"]),
            new PackageTableRecord(2021, 2300, ["VideoRecording", "Photography"]),
            new PackageTableRecord(2022, 2500, ["VideoRecording", "Photography"]),
            new PackageTableRecord(2020, 2500, ["VideoRecording", "Photography", "WeddingSession"]),
            new PackageTableRecord(2021, 2600, ["VideoRecording", "Photography", "WeddingSession"]),
            new PackageTableRecord(2022, 2500, ["VideoRecording", "Photography", "WeddingSession"]),
        ];
    }
}