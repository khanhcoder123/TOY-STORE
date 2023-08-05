// product.js

const { getDatabase, ObjectId } = require('./db');

const collectionName = 'toy';

// Hàm tạo ID tùy chỉnh
function generateCustomId() {
  const timestamp = Date.now().toString(36); // Chuyển timestamp thành chuỗi dạng 36 ký tự để rút ngắn độ dài
  const randomStr = Math.random().toString(36).substr(2, 5); // Lấy một phần của chuỗi số ngẫu nhiên

  return `${timestamp}-${randomStr}`;
}

async function getProducts() {
  const db = await getDatabase();
  return db.collection(collectionName).find().toArray();
}
// Hàm tạo sản phẩm mới
async function createProduct(item) {
  const db = await getDatabase();
  const productId = generateCustomId(); // Tạo ID tùy chỉnh
  item._id = productId; // Gán ID tùy chỉnh vào đối tượng sản phẩm
  const result = await db.collection(collectionName).insertOne(item);
  return result;
}

// Hàm lấy thông tin sản phẩm theo ID
async function getProductById(productId) {
  const db = await getDatabase();
  console.log('Searching for product with _id:', productId);
  const product = await db.collection(collectionName).findOne({ _id: productId });
  console.log('Product found:', product);
  return product;
}


// Hàm lấy thông tin sản phẩm theo tên
async function getProductByName(name) {
  const db = await getDatabase();
  const product = await db.collection(collectionName).findOne({ name: { $regex: name, $options: 'i' } });
  return product;
}

// Hàm cập nhật thông tin sản phẩm
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
async function searchProducts(query) {
  const db = await getDatabase();
  const products = await db.collection(collectionName).find({ name: { $regex: query, $options: 'i' } }).toArray();
  return products;
}

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
};