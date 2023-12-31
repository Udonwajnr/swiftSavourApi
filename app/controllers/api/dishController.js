const {Dish,Restaurant,Category} =require("../../../models")
const asyncHandler = require('express-async-handler')
const { success } = require("../../helpers/responseApi")
const {validationResult} =require('express-validator')

exports.getDish =asyncHandler(async(req,res)=>{
    const dish = await Dish.findAll({
        include: { all: true, nested: true }
    })

    return res.json(success(res.statusCode,{dish:{dish}}))
} )

exports.createDish =asyncHandler(async(req,res)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    const {restaurantName,categoryName,name,description,image,price} = req.body
    const restaurant = await Restaurant.findOne({
        where:{name:restaurantName},
    })
    const category = await Category.findOne({
        where:{name:categoryName},
    })
    const dish = await Dish.create({name,description,image,price,restaurantId:restaurant.id,categoryId:category.id})
    return res.json(success("Dish has been created successfully",res.statusCode,{dish:{dish}}))
})

exports.getDishDetail =asyncHandler(async(req,res)=>{
    const uuid = req.params.uuid
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
const dish = await Dish.findOne({
        where:{uuid},
        include: { all: true, nested: true }
    })
    return res.json(success(res.statusCode,{dish:{dish}}))
})

exports.updateDish = asyncHandler(async(req,res)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }

    const uuid =  req.params.uuid
    const  {name,description,image,price,categoryName} = req.body
    const dish = await Dish.findOne({
        where:{uuid}
    })
    const category = await Category.findOne({
        where:{name:categoryName},
    })
    dish.categoryId = category.id
    dish.name = name
    dish.description = description
    dish.price = price
    dish.image = image

    await dish.save()
    return res.json(success("dish has been updated successfully",res.statusCode,{dish:{dish}}))
})

exports.deleteDish=asyncHandler(async(req,res)=>{
    const uuid = req.params.uuid;
    const dish = await Dish.destroy({
        where:{uuid}
    })
    return res.json(success(`${req.body.name} has been deleted successfully`,res.statusCode,{dish:{dish}}))
})