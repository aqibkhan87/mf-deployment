import ProductCategoryModel from "../../models/ecommerce/e-product-category.js";
import ProductModel from "../../models/ecommerce/e-product.js";

// Define resolvers
const ProductResolver = {
  Query: {
    getAllProductCategories: async () => {
      return await ProductCategoryModel.find().populate("products");
    },
  },
  Mutation: {
    addProducts: async (_, { payload }) => {
      let categoriesProcessed = 0;
      let productsProcessed = 0;
      try {
        for (const category of payload) {
          const productIds = [];
  
          // Upsert each product with assigned categoryid = category.categoryid
          for (const product of category.products) {
            const updatedProduct = new ProductModel(product);
            await updatedProduct.save();
            productsProcessed++;
            // Only add product _id to this category if its categoryid matches
            if (updatedProduct.categoryid === category.categoryid) {
              productIds.push(updatedProduct._id);
            }
          }
  
          // Find if the category exists
          const existingCategory = await ProductCategoryModel.findOne({
            categoryid: category.categoryid,
          });

          if (existingCategory) {
            // Update category with filtered product IDs only
            await ProductCategoryModel.findOneAndUpdate(
              { categoryid: category.categoryid },
              {
                title: category.title,
                products: productIds, // products exclusively for this category
              },
              { new: true }
            );
            categoriesProcessed++;
          } else {
            // Create new category with only related product IDs
            const newCategory = new ProductCategoryModel({
              categoryid: category.categoryid,
              title: category.title,
              products: productIds,
            });
            await newCategory.save();
            categoriesProcessed++;
          }
        }

        return { message: "Added New Product Categories" };
      } catch(error) {
        console.log("errorr.   32323", error)
      }
    },
  },
};

export default ProductResolver;