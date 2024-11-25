import mongoose, { ObjectId } from "mongoose";
import { ProductModal } from "../../admin/products/model";
import { QueryParams } from "../auth/interface";
import { IAddAddress, IAddCartData, IAddOrder } from "./interface";
import { CartModel } from "./modal/cartModal";
import { object } from "joi";
import { AddressModel } from "./modal/addressModal";
import { OrdersModel } from "./modal/OrderModel";
import { ProductCategoryModal } from "../../admin/products-category/model";
import { PinModal } from "../../admin/pin/model";
const response: {
    message: string;
    data?: unknown;
    success: boolean;
} = { message: "", success: false };
interface IQuantity {
    quantity: number;
}
interface pinval{
    pin: number;
}
class UserProducts {
    async GetProducts({ page, limit, search, category, sort }: QueryParams) {
        try {
            console.log({ page, limit, search, category, sort })
            const offset = (page - 1) * limit;

            const matchStage: any = {};

            if (search) {
                matchStage.name = { $regex: search, $options: 'i' };
            }
            if (category) {
                matchStage.category_id = new mongoose.Types.ObjectId(category);
            }

            let sortStage = {};

            if (sort === "LowToHigh") {
                sortStage = { price: 1 };
            }
            else if (sort === "HighToLow") {
                sortStage = { price: -1 };
            } else {
                sortStage = { _id: 1 };
            }

            const products = await ProductModal.aggregate([
                {
                    $match: {
                        ...matchStage,
                        status: 'active'
                    }

                },
                {
                    $lookup: {
                        from: "products_categories",
                        localField: "category_id",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        price: 1,
                        quantity: 1,
                        description: 1,
                        image: 1,
                        category: { $first: "$category.name" }
                    }
                }
            ]).skip(offset).limit(limit).sort(sortStage);
            console.log(products)
            const totalProducts = await ProductModal.countDocuments(matchStage);

            return {
                success: true,
                message: "Products found",
                data: products,
                totalPages: Math.ceil(totalProducts / limit),
                currentPage: page,
            };
        } catch (error) {
            response.success = false;
            response.message = "An error occurred while fetching products";
        }
        return response;
    }
    async GetCategory() {
        try {
            const categories = await ProductCategoryModal.find({}, { name: 1, _id: 1 });
            response.message = "Categories fetched successfully";
            response.data = categories;
            response.success = true;
        } catch (error) {
            response.message = "Failed to fetch categories";
            response.success = false;
            response.data = [];
        }
        return response;
    }
    async GetProductsCart(user_id: string) {
        try {
            console.log(user_id)
            const id = new mongoose.Types.ObjectId(user_id);
            // const cartItems = await CartModel.find({ user_id:id, status: 'Pending' }, { product_id: 1, quantity: 1, total_price: 1,});
            const cartItems = await CartModel.aggregate([
                {
                    $match: {
                        user_id: id,
                        status: 'Pending'
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "product_id",
                        foreignField: "_id",
                        as: "product"
                    }
                },
                {
                    $unwind: {
                        path: "$product",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $project: {
                        _id: 1,
                        product_id: 1,
                        quantity: 1,
                        total_price: 1,
                        product_quantity: "$product.quantity",
                    }
                }
            ])
            if (!cartItems) {
                response.message = 'No cart items found';
                return response;
            }
            let totalPrice = 0;
            cartItems.forEach(item => {
                totalPrice += item.total_price;
            });
            response.success = true;
            response.message = "Cart items fetched successfully";
            response.data = cartItems;
        } catch (error) {
            response.message = "Failed to fetch cart items";
            response.success = false;
            response.data = [];
        }
        return response;
    }
    async CheckPin(pinval:pinval){
        try {
            console.log(pinval.pin);
            const pinData = await PinModal.aggregate([
                { $match: { pin: Number(pinval.pin) } }
            ])
            console.log(pinData)
            if (pinData.length===0) {
                response.success=false
                response.message = 'Pin not found';
                return response;
            }
            response.success = true;
            response.message = "Pin verified successfully";
        } catch (error) {
            response.message = "Failed to verify pin";
            response.success = false;
        }
        return response;
    }
    async AddCart(data: IAddCartData) {
        const { product_id, user_id } = data
        try {
            const product = await ProductModal.findById(product_id);
            if (!product) {
                response.message = 'Product not found';
                return response;
            }

            const productPrice = product.price;
            let cartItem = await CartModel.findOne({ product_id, user_id, status: 'Pending' });

            if (cartItem) {
                // Increment the quantity and update the total price
                cartItem.quantity += 1;
                cartItem.total_price = cartItem.quantity * productPrice;
                await cartItem.save();
                response.success = true;
                response.message = "Product added to cart successfully";
            } else {
                cartItem = await CartModel.findOne({ product_id, user_id, status: 'Purchased' });

                if (cartItem) {
                    // Create a new cart item with status 'Pending'
                    const newCart = new CartModel({
                        product_id,
                        user_id,
                        quantity: 1,
                        total_price: productPrice,
                        status: 'Pending'
                    });
                    await newCart.save();
                    response.success = true;
                    response.message = "Product added to cart successfully";
                } else {
                    // Create a new cart item
                    const newCart = new CartModel({
                        product_id,
                        user_id,
                        quantity: 1,
                        total_price: productPrice,
                        status: 'Pending'
                    });
                    await newCart.save();
                    response.success = true;
                    response.message = "Product added to cart successfully";
                }
            }

        } catch (error: any) {
            response.message = error.message || 'An error occurred';
        }

        return response;
    }
    async GetCart(user_id: string) {
        try {
            const cartItems = await CartModel.aggregate([
                {
                    $match: {
                        user_id: new mongoose.Types.ObjectId(user_id),
                        status: "Pending"
                    }
                }
            ]);
            const products = await Promise.all(cartItems.map(async (item) => {
                const product = await ProductModal.findById(item.product_id);
                if (product) {
                    return {
                        _id: item._id,
                        product_id: product._id,
                        name: product.name,
                        price: product.price,
                        quantity: item.quantity,
                        total_price: item.total_price,
                        image: product.image
                    }
                }
            }));
            return {
                success: true,
                message: "Cart fetched successfully",
                data: products
            }
        } catch (error) {
            response.success = false;
            response.message = "An error occurred while fetching cart";
        }
        return response;
    }
    async UpdateCart(id: string, quantity: IQuantity) {
        try {
            const cartItem = await CartModel.findById(id);
            if (!cartItem) {
                response.message = 'Cart item not found';
                return response;
            }

            // Find the product price by product ID
            const product = await ProductModal.findById(cartItem.product_id);
            if (!product) {
                response.message = 'Product not found';
                return response;
            }

            cartItem.quantity = quantity.quantity;
            cartItem.total_price = quantity.quantity * product.price;
            await cartItem.save()

            response.success = true;
            response.message = "Cart updated successfully";
            response.data = cartItem;
        } catch (error: any) {
            response.success = false;
            response.message = error.message;;
        }
        return response;
    }
    async DeleteCart(id: string) {
        try {
            const cartItem = await CartModel.findByIdAndUpdate(id, { status: 'deleted' });
            if (!cartItem) {
                response.message = 'Cart item not found';
                return response;
            }
            response.success = true;
            response.message = "Cart item deleted successfully";
            response.data = null;
        } catch (error: any) {
            response.success = false;
            response.message = error.message;
        }
        return response;
    }
    async EmptyCart(id: string) {
        try {
            console.log(id);
            const user_id = new mongoose.Types.ObjectId(id);
            await CartModel.updateMany({
                user_id: user_id,
                status: 'Pending'
            },
                {
                    $set: {
                        status: 'deleted'
                    }
                }
            );
            response.success = true;
            response.message = "Cart emptied successfully";
            response.data = null;
        } catch (error: any) {
            response.success = false;
            response.message = error.message;
        }
    }
    async AddOrder(data: IAddOrder) {
        try {
            const { user_id, total_price, address_id } = data;
            const GetAddressPin=await AddressModel.findById(new mongoose.Types.ObjectId(address_id))
            if(!GetAddressPin){
                response.success = false;
                response.message = 'Invalid address';
                response.data = null;
                return response;
            }
            const checkPin=await PinModal.find({pin: GetAddressPin.pin})
            if(checkPin.length === 0){
                response.success = false;
                response.message = 'cannot order on this address. please go to home page and check the availability of the products at your PIN ';
                response.data = null;
                return response;
            }
            const cartItems = await CartModel.aggregate([
                {
                    $match: {
                        user_id: new mongoose.Types.ObjectId(user_id),
                        status: "Pending"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        product_id: 1,
                        quantity: 1
                    }
                }
            ]);

            const cart_ids = cartItems.map((cartItem => {
                return cartItem._id.toString()
            }))
            const productsToUpdate = [];

            for (const cartItem of cartItems) {
                const product = await ProductModal.findById(cartItem.product_id);
                if (!product) {
                    response.success = false;
                    response.message = `Product with ID ${cartItem.product_id} not found.`;
                    return response;
                } else if (product.quantity < cartItem.quantity) {
                    response.success = false;
                    response.message = `Insufficient quantity for product ${product.name}. Required: ${cartItem.quantity}, Available: ${product.quantity}.`;
                    return response;
                } else {
                    // Add to the list of products to update later
                    productsToUpdate.push({
                        product_id: cartItem.product_id,
                        newQuantity: product.quantity - cartItem.quantity
                    });
                }
            }
            // All checks passed, now update product quantities
            for (const item of productsToUpdate) {
                await ProductModal.findByIdAndUpdate(item.product_id, {
                    quantity: item.newQuantity
                });
            }
            const newOrder = new OrdersModel({
                user_id,
                address_id,
                total_price,
                status: "Pending",
                cart_id: cart_ids
            });
            const myOrder = await newOrder.save();
            await CartModel.updateMany(
                {
                    user_id: new mongoose.Types.ObjectId(user_id),
                    status: 'Pending',
                },
                { $set: { status: 'Purchased' } }
            );


            response.success = true;
            response.message = "Order placed successfully";
            response.data = "newOrder";
            return response;
        } catch (error) {
            response.success = false;
            response.message = "An error occurred while placing order" + error;
            return response;
        }
    }
    async GetOrder(user_id: string) {
        try {
            const orders = await CartModel.aggregate([
                {
                    $match: {
                        user_id: new mongoose.Types.ObjectId(user_id),
                        status: "Pending"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "product_id",
                        foreignField: "_id",
                        as: "product"
                    }
                },
                {
                    $unwind: {
                        path: "$product",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $project: {
                        name: "$product.name",
                        image: "$product.image",
                        total_price: 1,
                        quantity: 1
                    }
                }
            ]);
            response.success = true;
            response.message = "Orders fetched successfully";
            response.data = orders;

        }
        catch (err) {
            response.success = false;
            response.message = "An error occurred while fetching orders";
        }
        return response;
    }
    async AddAddress(id: string, data: IAddAddress) {
        try {
            const checkUser = await AddressModel.find({ user_id: id })
            if (checkUser.length === 0) {
                const address = new AddressModel({
                    user_id: id,
                    city: data.city,
                    state: data.state,
                    pin: data.pin,
                    house_no: data.house_no,
                    isDefault: true,
                })
                const addressSaved = await address.save();
                if (!addressSaved) {
                    response.success = false
                    response.message = 'address not saved';
                    return response;
                }
            } else {
                await AddressModel.updateMany(
                    { user_id: id, }, {
                    $set: { isDefault: false }
                })
                const Newaddress = new AddressModel({
                    user_id: id,
                    city: data.city,
                    state: data.state,
                    pin: data.pin,
                    house_no: data.house_no,
                    isDefault: true,
                })
                const addressSaved = await Newaddress.save();
                if (!addressSaved) {
                    response.success = false
                    response.message = 'address not saved';
                    return response;
                }
            }
            response.success = true;
            response.message = "Address added successfully";
            response.data = null;
        } catch (error: any) {
            response.success = false;
            response.message = error.message;
        }
        return response;
    }
    async UpdateAddressStatus(User_id: string, address_id: string) {
        try {
            await AddressModel.updateMany({
                user_id: User_id,
            }, {
                $set: {
                    isDefault: false
                }
            })
            const deafultAddress = await AddressModel.findByIdAndUpdate(address_id, { isDefault: true })
            if (!deafultAddress) {
                response.success = false
                response.message = 'address not found';
                return response;
            }
            response.success = true;
            response.message = "Address status updated successfully";
            response.data = null;
        } catch (error: any) {
            response.success = false;
            response.message = error.message;
        }
        return response;
    }
    async GetAddress(id: string) {
        try {
            const adddress_default=await AddressModel.find({ user_id: id, isDefault:1 });
            const pinPrice=await PinModal.aggregate([
                { $match: { pin: adddress_default[0].pin } },
                { $project: { price: 1 } }
            ])
            const addresses = await AddressModel.find({ user_id: id }, {
                _id: 1,
                city: 1,
                state: 1,
                pin: 1,
                house_no: 1,
                isDefault: 1
            });
            if(pinPrice.length > 0) {
                response.success = true;
                response.message = "Addresses fetched successfully";
                response.data = {
                    addresses,
                    pinPrice: pinPrice[0].price
                };
            }else{
                response.success = true;
                response.message = "Addresses fetched successfully";
                response.data = {
                    addresses,
                    pinPrice: 0
                };
            }
            
        } catch (error: any) {
            response.success = false;
            response.message = error.message;
        }
        return response;
    }
    async GetAllOrder(id: string) {
        try {
            const orders = await OrdersModel.aggregate([
                {
                    $match: {
                        user_id: new mongoose.Types.ObjectId(id)
                    }
                },
                { $unwind: '$cart_id' },

                {
                    $addFields: {
                        cart_id: { $toObjectId: '$cart_id' }
                    }
                },
                {
                    $lookup: {
                        from: 'carts',
                        localField: 'cart_id',
                        foreignField: '_id',
                        as: 'cart_items'
                    }
                },
                { $unwind: '$cart_items' },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'cart_items.product_id',
                        foreignField: '_id',
                        as: 'product_details'
                    }
                },
                { $unwind: '$product_details' },
                {
                    $lookup: {
                        from: 'addresses',
                        localField: 'address_id',
                        foreignField: '_id',
                        as: 'address_details'
                    }
                },
                { $unwind: '$address_details' },
                {
                    $group: {
                        _id: '$_id',
                        total_price: { $first: '$total_price' },
                        address: { $first: '$address_details' },
                        products: {
                            $addToSet: {
                                name: '$product_details.name',
                                price: '$product_details.price',
                                total_price: '$cart_items.total_price',
                                quantity: '$cart_items.quantity'
                            }
                        }
                    }
                },
                {
                    $project: {
                        total_price: 1,
                        address: {
                            pin: '$address.pin',
                            house_no: '$address.house_no',
                            city: '$address.city',
                            state: '$address.state'
                        },
                        products: 1
                    }
                }
            ]);
            if (orders) {
                response.success = true;
                response.message = "Orders fetched successfully";
                response.data = orders;
            } else {
                response.success = false;
                response.message = "No orders found";
                return response;
            }

            return response
        } catch (error) {
            response.success = false;
            response.message = "An error occurred while fetching orders";
            return response;
        }
    }
}
export default new UserProducts