const {Category,Dish,Restaurant} =require("../../../models")
const asyncHandler = require('express-async-handler')
const { success } = require("../../helpers/responseApi")
const {validationResult} =require('express-validator')



exports.getCategory =asyncHandler(async(req,res)=>{
    const category = await Category.findAll({
        include:[{model:Restaurant,as:"restaurant"},{model:Dish,as:"dish"}]
}
    )
    return res.json(success(res.statusCode,{category:{category}}))
} )

exports.createCategory = asyncHandler(async(req,res)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    const {name,restaurantName} = req.body
    const restaurant = await Restaurant.findOne({
        where:{name:restaurantName},
    })
    const category = await Category.create({name,categoryRestaurantId:restaurant.id})
    return res.json(success("category has been created successfully",res.statusCode,{category:{category}}))
})

exports.getCategoryDetail =asyncHandler(async(req,res)=>{
    const uuid = req.params.uuid
    const category = await Category.findOne({
        where:{uuid},
        include:[{model:Restaurant,as:"restaurant"},{model:Dish,as:"dish"}]
    })
    return res.json(success(res.statusCode,{category:{category}}))
})


exports.updateCategory = asyncHandler(async(req,res)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    const uuid =  req.params.uuid
    const  {name} = req.body
    const category = await Category.findOne({
        where:{uuid}
    })
    category.name = name
    await category.save()
    return res.json(success("category has been updated successfully",res.statusCode,{category:{category}}))
})


exports.deleteCategory=asyncHandler(async(req,res)=>{
    const uuid = req.params.uuid;
    const category = await Category.destroy({
        where:{uuid}
    })
    return res.json(success(`${req.body.name} has been deleted successfully`,res.statusCode,{category:{category}}))
})
