 // Hàm xử lý tìm kiếm sản phẩm
 function searchProduct() {
    const keyword = document.getElementById('searchInput').value;
    window.location.href = `/?keyword=${keyword}`;
  }