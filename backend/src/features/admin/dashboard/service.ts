import { on } from "events";
import { UserModel } from "../users/model/userModel";
import { OrdersModel } from "../../user/products/modal/OrderModel";
import { CartModel } from "../../user/products/modal/cartModal";

const response: {
    message: string;
    data?: unknown;
    success: boolean;
} = { message: "", success: false };
class DashboardService {
    async getUserCardData() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const thisWeekUsersPipeline = await UserModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: oneWeekAgo },
                    actionType: "user"
                }
            },
            {
                $count: "thisWeekUsers"
            }
        ]);

        const lastWeekUsersPipeline = await UserModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo },
                    actionType: "user"
                }
            },
            {
                $count: "lastWeekUsers"
            }
        ]);
        const thisWeekUsers = thisWeekUsersPipeline.length > 0 ? thisWeekUsersPipeline[0].thisWeekUsers : 0;
        const lastWeekUsers = lastWeekUsersPipeline.length > 0 ? lastWeekUsersPipeline[0].lastWeekUsers : 0;

        const totalUser = thisWeekUsers + lastWeekUsers;
        const thisWeekUsersPercentage = ((thisWeekUsers - lastWeekUsers) / lastWeekUsers) * 100
        let Percentage = '';
        if (lastWeekUsers > thisWeekUsers) {
            Percentage = 'Decreased';
        } else {
            Percentage = 'Increased';
        }
        const data = {
            totalUser,
            thisWeekUsersPercentage,
            Percentage
        };
        return data
    }
    async getOrdercardData() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const thisWeekOrdersPipeline = await OrdersModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: oneWeekAgo },
                    status: "Pending"
                }
            },
            {
                $count: "thisWeekOrders"
            }
        ]);
        const lastWeekOrdersPipeline = await OrdersModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo },
                    status: "Pending"
                }
            },
            {
                $count: "lastWeekOrders"
            }
        ]);
        const totalOrdersPipeline = await OrdersModel.aggregate([
            {
                $match: {
                    status: "Pending"
                }
            },
            {
                $count: "totalOrders"
            }
        ]);
        const thisWeekOrders = thisWeekOrdersPipeline.length > 0 ? thisWeekOrdersPipeline[0].thisWeekOrders : 0;
        const lastWeekOrders = lastWeekOrdersPipeline.length > 0 ? lastWeekOrdersPipeline[0].lastWeekOrders : 0;
        const totalOrders = totalOrdersPipeline.length > 0 ? totalOrdersPipeline[0].totalOrders : 0;
        let thisWeekOrdersPercentage;
        let Percentage;

        if (lastWeekOrders > 0) {
            thisWeekOrdersPercentage = ((thisWeekOrders - lastWeekOrders) / lastWeekOrders) * 100;
            Percentage = thisWeekOrders > lastWeekOrders ? 'Increased' : 'Decreased';
        } else {
            thisWeekOrdersPercentage = thisWeekOrders > 0 ? thisWeekOrders * 100 : 0;
            Percentage = thisWeekOrders > 0 ? 'Increased' : 'No change';
        }
        const data = {
            totalOrders,
            thisWeekOrdersPercentage,
            Percentage
        };
        return data;
    }
    async getEarningcardData() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        // console.log(oneWeekAgo,twoWeeksAgo)
        const thisweekEarningPipeline = await OrdersModel.aggregate([
            {
                $match: {
                    updatedAt: { $gte: oneWeekAgo },
                    status: "Completed"
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: "$total_price" }
                }
            }
        ])
        const lastWeekEarningPipeline = await OrdersModel.aggregate([
            {
                $match: {
                    updatedAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo },
                    status: "Completed"
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: "$total_price" }
                }
            }
        ])
        const totalEarningPipeline = await OrdersModel.aggregate([
            {
                $match: {
                    status: "Completed"
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: "$total_price" }
                }
            }
        ])
        const thisWeekEarnings = thisweekEarningPipeline.length > 0 ? thisweekEarningPipeline[0].totalEarnings : 0
        const lastWeekEarnings = lastWeekEarningPipeline.length > 0 ? lastWeekEarningPipeline[0].totalEarnings : 0
        const totalEarnings = totalEarningPipeline.length > 0 ? totalEarningPipeline[0].totalEarnings : 0
        // console.log(totalEarnings, lastWeekEarnings, thisWeekEarnings)
        let thisWeekEarningPercentage;
        let Percentage;
        if (lastWeekEarnings > 0) {
            thisWeekEarningPercentage = ((thisWeekEarnings - lastWeekEarnings) / lastWeekEarnings) * 100
            Percentage = thisWeekEarnings > lastWeekEarnings ? 'Increased' : 'Decreased'
        } else {
            thisWeekEarningPercentage = thisWeekEarnings > 0 ? thisWeekEarnings * 100 : 0
            Percentage = thisWeekEarnings > 0 ? 'Increased' : 'No change'
        }
        const data = {
            totalEarnings,
            thisWeekEarningPercentage,
            Percentage
        }
        return data;

    }
    async getLineChartdata() {
        const purchasedProducts = await CartModel.aggregate([
            {
                $match: {
                    status: "Purchased"
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'Products'
                }
            },
            {
                $unwind: {
                    path: '$Products',
                }
            },
            {
                $group: {
                    _id: { product_id: "$product_id", product_name: "$Products.name" },
                    totalCount: { $sum: "$quantity" }
                }
            }
        ])
        const sortedProducts = purchasedProducts.sort((a, b) => b.totalCount - a.totalCount);

        // Finding the most and least purchased products
        const maxPurchasedProduct = sortedProducts[0];
        const secondMaxPurchasedProduct = sortedProducts[1];
        const thirdMaxPurchasedProduct = sortedProducts[2];

        // const leastPurchasedProduct = sortedProducts[sortedProducts.length - 1];
        return {
            labels:[
                thirdMaxPurchasedProduct._id.product_name,
                secondMaxPurchasedProduct._id.product_name,
                maxPurchasedProduct._id.product_name,
            ],
            datasets:[
                thirdMaxPurchasedProduct.totalCount,
                secondMaxPurchasedProduct.totalCount,
                maxPurchasedProduct.totalCount,

            ],
        };
    }

    async getUserdata(){
        const customerServices = await UserModel.aggregate([
            {
                $match: {
                    actionType: "user"
                }
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    dob: 1,
                    gender: 1,
                    status: 1,
                }
            },
            {
                $sort:{
                    _id:-1
                }
            }
        ]).limit(5);
        return customerServices;
    }
}

export default new DashboardService
