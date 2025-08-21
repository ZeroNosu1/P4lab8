'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Category = {
  id: number
  name: string
}

type Product = {
  id: number
  name: string
  description: string
  price: number
  category?: Category | null
  imageUrl?: string // เผื่ออนาคตมีรูป
}

export default function ProductListPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | 'All'>('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const categoryRes = await fetch('/api/categories')
        const categoryData: Category[] = await categoryRes.json()
        setCategories([{ id: 0, name: 'All' }, ...categoryData])

        const productRes = await fetch('/api/products')
        const productData: Product[] = await productRes.json()
        setProducts(productData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        ⏳ กำลังโหลดสินค้า...
      </div>
    )
  }

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category?.id === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            🛒 สินค้าของเรา
          </h1>
          <button
            onClick={() => router.push('/products/new')}
            className="bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 shadow-md transition transform hover:scale-105"
          >
            ➕ เพิ่มสินค้าใหม่
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === 0 ? 'All' : cat.id)}
              className={`px-5 py-2.5 rounded-full font-medium shadow-sm transition-all duration-200 ${
                selectedCategory === (cat.id === 0 ? 'All' : cat.id)
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">ไม่มีสินค้าที่จะแสดง</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                {/* Product Image */}
                <div className="h-40 bg-gray-100 rounded-t-2xl flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <span className="text-gray-400">📦 ไม่มีภาพ</span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <p
                    className={`text-xs font-medium mb-3 ${
                      product.category ? 'text-blue-500' : 'text-gray-400'
                    }`}
                  >
                    {product.category
                      ? `📂 หมวดหมู่: ${product.category.name}`
                      : 'ไม่มีหมวดหมู่'}
                  </p>
                  <div className="mt-auto">
                    <p className="text-xl font-extrabold text-green-600 mb-3">
                      {product.price.toLocaleString()} บาท
                    </p>
                    <button className="w-full rounded-xl bg-blue-600 text-white py-2 font-semibold hover:bg-blue-700 transition transform hover:scale-105">
                      🛍️ เพิ่มลงตะกร้า
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
