
export class PricingTableRecord {
    readonly year : number;
    readonly price : number;
    
    constructor(year: number, price: number) {
        this.year = year;
        this.price = price;
    }
}