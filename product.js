// product.js
const { getDatabase } = require('./db');

const collectionName = 'toy';

async function getProducts() {
  const db = await getDatabase();
  return await db.collection(collectionName).find().toArray();
}

async function createProduct(item) {
  const db = await getDatabase();
  const result = await db.collection(collectionName).insertOne(item);
  return result;
}

async function getProductById(productId) {
  const db = await getDatabase();
  return db.collection(collectionName).findOne({ _id: productId });
}

async function updateProduct(productId, newData) {
  const db = await getDatabase();
  const result = await db.collection(collectionName).updateOne(
    { _id: productId },
    { $set: newData }
  );
  return result;
}

async function deleteProduct(productId) {
  const db = await getDatabase();
  const result = await db.collection(collectionName).deleteOne({ _id: productId });
  return result;
}

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
