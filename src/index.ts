import { ServicesOrchestrator } from "./logic/services/services-orchestrator";

export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
    const servicesOrchestrator = new ServicesOrchestrator(previouslySelectedServices);
    servicesOrchestrator.updateServicesSelection(action.type, action.service);
    return servicesOrchestrator.getSelectedServices();
};

export const calculatePrice = (
    selectedServices: ServiceType[], 
    selectedYear: ServiceYear
) => {
    const servicesOrchestrator = new ServicesOrchestrator(selectedServices);
    return servicesOrchestrator.getPrice(selectedYear);
};