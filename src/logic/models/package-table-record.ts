export class PackageTableRecord {
    readonly servicesTypes : string[];
    readonly year : number;
    readonly price : number;
    
    constructor(year: number, price: number, servicesTypes : string[] = []) {
        this.year = year;
        this.price = price;
        this.servicesTypes = servicesTypes;
    }
}