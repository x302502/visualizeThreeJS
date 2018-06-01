interface Math {
    /**
     * 
     * @param degrees number 0 to 360
     */
    parseDegreesToRadian(degrees: number): number;
    /**
     * 
     * @param radian float 0  -> 2
     */
    parseRadianToDegrees(radian: number): number;
}
Math.parseDegreesToRadian =(degrees: number)=> {
    return degrees * Math.PI/180;
}
Math.parseRadianToDegrees = (radian: number) => {
    return Math.floor(radian * 180 /Math.PI);
}
interface Date 
{
    testPrototype: string;
    testFunction(str: string):string;
    
}
Date.prototype.testFunction = (str:string) => {
    return str;
};
Date.prototype.testPrototype = '123';