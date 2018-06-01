export interface IDoughnutChartOption {
    title?: string;
    items: {
        title: string;
        value: number;
        color?: string;
        data?: any;
    }[]
}