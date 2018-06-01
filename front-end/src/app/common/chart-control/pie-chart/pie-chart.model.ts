export interface IPieChart{
    width: number;
    height: number;
    title?: string;
    items: {
        title: string;
        value: number;
        color: string;
        data?: any;
    }[];
    click?: Function
}