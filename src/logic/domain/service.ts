import { PricingTableRecord } from "../models/pricing-table-record";

export class Service {
    orderNumber: number | null;
    type: string;
    dependsOnTypes: string[] | null;
    private _isSelected : boolean;
    private _pricingTable : PricingTableRecord[];
    
    constructor(
        type: string, 
        dependsOnTypes: string[] | null = null, 
        pricingTable : PricingTableRecord[] = []
    ) {
        this.type = type;
        this.dependsOnTypes = dependsOnTypes;
        this._pricingTable = pricingTable;
    }

    public select() : void {
        this._isSelected = true;
    }

    public deselect() : void {
        this._isSelected = false;
    }

    public checkIfSelected() : boolean {
        return this._isSelected;
    }

    public checkIfHasPricingTable() : boolean {
        return this._pricingTable.length > 0;
    }

    public getPrice(year : number) : number {
        return this._pricingTable.find(x => x.year == year)?.price;
    }
}