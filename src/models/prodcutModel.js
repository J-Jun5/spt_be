import { productModel } from '../models/productModel'; // 리팩토링된 모델을 import

export const commonProductCtrl = {
  // 전체 상품 조회 API
  getAllProducts: async (req, res) => {
    try {
      const { page = 1, limit = 10, sort = "recent", search = "" } = req.query;
      const offset = (page - 1) * limit; // 페이지네이션 계산

      let orderBy; // 정렬 기준 설정
      if (sort === "recent") {
        orderBy = { createdAt: "desc" };
      } else if (sort === "price_asc") {
        orderBy = { price: "asc" };
      } else if (sort === "price_desc") {
        orderBy = { price: "desc" };
      } else {
        orderBy = { createdAt: "desc" }; // 기본값
      }

      // 검색 조건 설정
      const where = {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive", // 대소문자 구분 없이 검색
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      };

      // 상품 목록 조회
      const products = await productModel.getAllProducts({ where, orderBy, offset, limit }); // 변경된 부분: 모델 메서드 호출

      // 총 상품 수 조회 (페이지네이션 용)
      const totalProducts = products.length; // 모델에서 받아온 products의 길이로 전체 수 계산

      res.status(200).json({
        data: products,
        pagination: {
          total: totalProducts,
          page: parseInt(page),
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // 상품 수정 API
  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { img, name, description, price, like, tags } = req.body;

    try {
      const updatedProduct = await productModel.updateProduct(parseInt(id), {
        img,
        name,
        description,
        price,
        like,
        tags,
      }); // 변경된 부분: 모델 메서드 호출

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      if (error.code === "P2025") {
        // Prisma specific error for not found record
        res.status(404).json({ error: "Product not found" });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  },

  // 상품 삭제 API
  deleteProduct: async (req, res) => {
    const { id } = req.params;

    try {
      await productModel.deleteProduct(parseInt(id)); // 변경된 부분: 모델 메서드 호출

      res.status(204).send(); // No Content
    } catch (error) {
      console.error("Error deleting product:", error);
      if (error.code === "P2025") {
        // Prisma specific error for not found record
        res.status(404).json({ error: "Product not found" });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  },

  // 상품 추가 API
  createProduct: async (req, res) => {
    const { img, name, description, price, tags } = req.body;

    try {
      const newProduct = await productModel.createProduct({
        img,
        name,
        description,
        price,
        tags,
      }); // 변경된 부분: 모델 메서드 호출

      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // 특정 상품 조회 API
  getProductById: async (req, res) => {
    const { id } = req.params;

    try {
      const product = await productModel.getProductById(parseInt(id)); // 변경된 부분: 모델 메서드 호출

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
