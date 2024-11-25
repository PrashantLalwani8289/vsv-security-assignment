export interface GetDashboardData{
    getUserCardData:getUserCardData,
    getOrdercardData:getOrdercardData,
    getEarningcardData:getEarningcardData,
    getLineChartdata:getLineChartdata,
    getUserdata:getUserdata[]
}
export interface getUserCardData{
    totalUser:number,
    thisWeekUsersPercentage:number,
    Percentage:string
}
export interface getOrdercardData{
    totalOrders:number,
    thisWeekOrdersPercentage:number,
    Percentage:string
}
export interface getEarningcardData{
    totalEarnings:number,
    thisWeekEarningPercentage:number,
    Percentage:string
}
export interface getLineChartdata{
    labels:string[],
    datasets:Array<{data:number[]}>
}
export interface getUserdata{
    _id:string,
    username:string,
    email:string,
    dob:string,
    gender:string,
    status:string
}

export interface GetProfileData{
    _id: string,
    username: string,
    email: string,
    dob: string,
    gender: string,
    role:string
}