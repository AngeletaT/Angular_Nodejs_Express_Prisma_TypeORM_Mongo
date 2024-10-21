const Category = require("../models/category.model.js");
const asyncHandler = require('express-async-handler');

//  #region CREAR CATEGORIA
const create = asyncHandler(async (req, res) => {

  const category_data = {
    id_cat: req.body.id_cat || null,
    category_name: req.body.category_name || null,
    image: req.body.image || null,
    jobs: []
  };

  const category = await new Category(category_data);
  const new_category = await category.save();
  res.json(new_category);
});

// #region LISTAR TODO
const findAll = asyncHandler(async (req, res) => {

  const { offset, limit } = req.query;

  const categories = await Category.find({}, {}, { skip: Number(offset), limit: Number(limit) });

  if (!categories) {
    return res.status(401).json({
      message: "Categoria no encontrada"
    })
  }

  return res.status(200).json({
    categories: await Promise.all(categories.map(async categories => {
      return await categories.toCategoryResponse()
    }))
  });
});

// #region LISTAR UNO
const findOne = asyncHandler(async (req, res) => {

  const categories = await Category.findOne(req.params)

  if (!categories) {
    return res.status(401).json({
      message: "Categoria no encontrada"
    })
  }
  return res.status(200).json({
    categories: await categories.toCategoryResponse()
  })
});

// #region LISTAR CATEGORIAS PARA SELECT
const findCategoriesSelect = asyncHandler(async (req, res) => {

  const categories = await Category.find();

  if (!categories) {
    return res.status(401).json({
      message: "Category not found"
    })
  }

  return res.status(200).json({
    categories: await Promise.all(categories.map(async categories => {
      return await categories.toCategoryResponse()
    }))
  });
});


// #region ELIMINAR
const delete_category = asyncHandler(async (req, res) => {
  await Category.findOneAndDelete(req.params);
  res.send({ message: "Categoria eliminada correctamente" });
});

// #region EXPORTS
module.exports = {
  create,
  findAll,
  findOne,
  delete_category,
  findCategoriesSelect
}