export interface ILineChartOption {
    title?: string;
    xTitle?: string;
    yTitle?: string;
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        color?: string;
    }[];
}