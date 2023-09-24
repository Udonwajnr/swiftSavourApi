const {Restaurant,Dish} =require("../../../models")
const asyncHandler = require('express-async-handler')
const { success } = require("../../helpers/responseApi")
const {validationResult} =require('express-validator')

exports.getRestaurant =asyncHandler(async(req,res)=>{
    const restaurants = await Restaurant.findAll(
    {        
        include: { all: true, nested: true }
    }
    
    )
    return res.json(success(res.statusCode,{restaurants:{restaurants}}))
} )

exports.createRestaurant =asyncHandler(async(req,res)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    const {name,address,latitude,longitude,rating,phoneNumber,deliveryTime,logo,image} = req.body
    const restaurant = await Restaurant.create({name,address,latitude,longitude,rating,phoneNumber,deliveryTime,logo,image})
    return res.json(success("Restaurant has been created successfully",res.statusCode,{restaurant:{restaurant}}))
})

exports.getRestaurantDetail =asyncHandler(async(req,res)=>{
    const uuid = req.params.uuid
    const restaurant = await Restaurant.findOne({
        where:{uuid}
    })
    return res.json(success(res.statusCode,{restaurant:{restaurant}}))
})

exports.updateRestaurant =asyncHandler(async(req,res)=>{
    const uuid =req.params.uuid
    const {name,address,latitude,longitude,rating,phoneNumber,deliveryTime,logo,image} = req.body
    const restaurant = await Restaurant.findOne({
        where:{uuid}
    })
    restaurant.name =name
    restaurant.address =address
    restaurant.latitude =latitude
    restaurant.longitude =longitude
    restaurant.rating = rating
    restaurant.phoneNumber = phoneNumber
    restaurant.deliveryTime = deliveryTime
    restaurant.logo = logo
    restaurant.image = image
    await restaurant.save()
    return res.json(success("Restaurant has been updated successfully",res.statusCode,{restaurant:{restaurant}}))
})


exports.deleteRestaurant=asyncHandler(async(req,res)=>{
    const uuid = req.params.uuid;
    const restaurant = await Restaurant.destroy({
        where:{uuid}
    })
    return res.json(success(`${req.body.name} has been deleted successfully`,res.statusCode,{restaurant:{restaurant}}))
})