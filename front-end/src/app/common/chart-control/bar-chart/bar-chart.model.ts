export interface IBarChartOption {
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