export interface User {
    token: string;
    parentuser: string;
    username: string;
    fullname: string;
    email: string;
    tel: string;
    type: number;
    whseid: string;
    warehousename: string;
    owners?: {
        id: number;
        type: string;
        address1: string;
        company: string;
        lottable: string;
        storerkey: string;
        warehousecode: string;
    }[];
    strOwners?: string;
    warehouses?: {
        id: number;
        parentuser: string;
        warehousecode: string;
        warehousename: string
    }[]
}