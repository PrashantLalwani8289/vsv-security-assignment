import {Request,Response} from "express";
import DashboardService from "./service"

export const getDashboardData = async (req:Request, res:Response) => {
    try {
        const getUserCardData = await DashboardService.getUserCardData()
        const getOrdercardData = await DashboardService.getOrdercardData()
        const getEarningcardData = await DashboardService.getEarningcardData()
        const getLineChartdata = await DashboardService.getLineChartdata()
        const getUserdata = await DashboardService.getUserdata()

        const result ={
            getUserCardData,
            getOrdercardData,
            getEarningcardData,
            getLineChartdata,
            getUserdata
        }
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};