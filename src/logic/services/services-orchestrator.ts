import { PackageTableRecord } from "../models/package-table-record";
import { Service } from "../domain/service";
import { DataHelper } from "../utils/data-helper";
import { ServiceType } from "../..";

export class ServicesOrchestrator {
    private _services : Service[];
    private _packages : PackageTableRecord[];

    constructor(previouslySelectedServices: ServiceType[]) {
        this._services = DataHelper.getServices();
        this._packages = DataHelper.getPackages();
        this.selectPreviouslySelectedServices(previouslySelectedServices);
    }

    public updateServicesSelection(actionType: "Select" | "Deselect", serviceType: ServiceType) : void {
        const service = this._services.find(x => x.type == serviceType);

        if(service == null) {
            return;
        }
        
        if(actionType == "Select") {
            this.selectService(service);
        } else if(actionType == "Deselect") {
            this.deselectService(service);
        }
    }

    public getSelectedServices() : string[] {
        return this._services
            .filter(x => x.checkIfSelected())
            .sort((a,b) => a.orderNumber - b.orderNumber)
            .map(x => x.type);
    }

    public getPrice(year : number) {
        var price = 0;
        const selectedServices = this._services
            .filter(x => x.checkIfSelected() && x.checkIfHasPricingTable());
            
        selectedServices?.forEach(x => {
            const servicePrice = x.getPrice(year);
            price += servicePrice;
        })

        const packagePrice = this.getPackagePrice(year, selectedServices);

        return ({ 
            basePrice: price, 
            finalPrice: packagePrice == 0 
                ? price 
                : packagePrice 
        });
    }

    private selectService(service : Service) : void {
        if(service.dependsOnTypes != null) {
            const hasDependencySelected = this._services
                .filter(x => service.dependsOnTypes.includes(x.type))
                .every(x => x.checkIfSelected());
            if(!hasDependencySelected) {
                return;
            }
        }
        this.selectServiceAndSetOrderNumber(service);
        this.selectDependentServices(service.type);
    }

    private deselectService(service : Service) : void {
        const selectedMainServicesTypes = this._services
                .filter(x => x.checkIfSelected())
                .filter(x => x.dependsOnTypes == null)
                .sort((a,b) => a.orderNumber - b.orderNumber)
                .map(x => x.type);
                
            const lastItemIndex = selectedMainServicesTypes.length - 1;

            if(selectedMainServicesTypes.indexOf(service.type) == lastItemIndex) {
                const servicesForDeselection = this._services
                    .filter(x => x.checkIfSelected())
                    .filter(x => x.dependsOnTypes != null)
                    .filter(x => x.dependsOnTypes.includes(service.type));

                servicesForDeselection?.forEach(x => x.deselect());
            }

            service.deselect();
            this.deselectDependentServices(service.type);
    }

    private selectPreviouslySelectedServices(previouslySelectedServices: ServiceType[]) : void {
        previouslySelectedServices?.forEach(x => {
            const service = this._services.find(v => v.type == x);
            if(service != null) {
                this.selectServiceAndSetOrderNumber(service);
            }
        });
    }

    private getPackagePrice(year : number, selectedServices : Service[]) : number {
        var packagePrice = 0;
        const selectedServicesTypes = selectedServices.map(s => s.type);
        var packagesPrices = [];
        this._packages.filter(x => x.year == year)?.forEach(x => {
            const hasPackage = x.servicesTypes.every(v => selectedServicesTypes.includes(v));
            if(hasPackage) {
                packagesPrices.push(x.price);
            }
        })

        if(packagesPrices.length > 0) {
            packagePrice = packagesPrices.sort((a,b) => b - a)[0];
        }

        return packagePrice;
    }

    private selectDependentServices(serviceType : string) : void {
        const dependentServices = this._services
            .filter(x => x.dependsOnTypes != null)
            .filter(x => x.dependsOnTypes.includes(serviceType));

        if(dependentServices.length > 0) {
            dependentServices.forEach(x => {
                if(x.dependsOnTypes.length > 1) {
                    const allServicesSelected = this._services
                        .filter(x => x.dependsOnTypes != null)
                        .filter(x => x.dependsOnTypes.includes(serviceType))
                        .every(x => x.checkIfSelected());

                    if(allServicesSelected) {
                        this.selectServiceAndSetOrderNumber(x);
                    }
                } else {
                    this.selectServiceAndSetOrderNumber(x);
                }
            });
        }
    }

    private selectServiceAndSetOrderNumber(service : Service) : void {
        if(service.orderNumber == null) {
            service.orderNumber = this.getNextServiceOrderNumber();
        }
        service.select()
    } 

    private deselectDependentServices(serviceType : string) : void {
        const dependentServices = this._services
            .filter(x => x.dependsOnTypes != null)
            .filter(x => x.dependsOnTypes.includes(serviceType));

        if(dependentServices.length > 0) {
            dependentServices.forEach(x => { 
                const hasSomeSelectedDependecies = this._services
                    .filter(v => x.dependsOnTypes.includes(v.type))
                    .some(v => v.checkIfSelected());
                if(!hasSomeSelectedDependecies) {
                    x.deselect()
                }
            });
        }
    }

    private getNextServiceOrderNumber() : number {
        if(!this._services.some(x => x.orderNumber != null)) {
            return 1;
        }

        const result = Math.max(...this._services
            .filter(x => x.orderNumber != null)
            .map(x => x.orderNumber), 0);
        return result + 1;
    }
}