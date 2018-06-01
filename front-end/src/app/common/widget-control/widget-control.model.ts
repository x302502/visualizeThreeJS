export interface IWidget{
    title?: string;
    buttons?: {
        title?: string,
        click: Function
    }[]
}