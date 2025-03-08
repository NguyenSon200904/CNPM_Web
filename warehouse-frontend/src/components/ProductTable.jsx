const ProductTable = () => {
  const products = [
    { id: 1, name: "Sản phẩm A", price: 10000, stock: 20 },
    { id: 2, name: "Sản phẩm B", price: 20000, stock: 15 },
    { id: 3, name: "Sản phẩm C", price: 30000, stock: 10 },
  ];

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 px-4 py-2">Mã SP</th>
          <th className="border border-gray-300 px-4 py-2">Tên sản phẩm</th>
          <th className="border border-gray-300 px-4 py-2">Giá</th>
          <th className="border border-gray-300 px-4 py-2">Số lượng</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="hover:bg-gray-100">
            <td className="border border-gray-300 px-4 py-2">{product.id}</td>
            <td className="border border-gray-300 px-4 py-2">{product.name}</td>
            <td className="border border-gray-300 px-4 py-2">
              {product.price}đ
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {product.stock}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
