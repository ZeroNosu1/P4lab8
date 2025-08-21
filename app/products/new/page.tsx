'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Category = { id: number; name: string }

export default function NewProductPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [customCategory, setCustomCategory] = useState('')

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then((data: Category[]) => {
        setCategories(data)
        if (data.length > 0) setCategoryId(data[0].id)
      })
      .catch(err => console.error(err))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let finalCategoryId = categoryId

    if (customCategory.trim() !== '') {
      const resCat = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: customCategory }),
      })
      const dataCat = await resCat.json()
      finalCategoryId = dataCat.id
    }

    if (!finalCategoryId) return alert('กรุณาเลือกหมวดหมู่')

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        categoryId: finalCategoryId,
      }),
    })

    if (res.ok) router.push('/products')
    else {
      const data = await res.json()
      alert('Error: ' + data.error)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          เพิ่มสินค้าใหม่
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ชื่อสินค้า */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">ชื่อสินค้า</label>
            <input
              type="text"
              placeholder="ชื่อสินค้า"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* รายละเอียด */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">รายละเอียดสินค้า</label>
            <textarea
              placeholder="รายละเอียดสินค้า"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* ราคา */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">ราคาสินค้า</label>
            <input
              type="number"
              placeholder="ราคาสินค้า"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* หมวดหมู่ */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">หมวดหมู่</label>
            <select
              value={categoryId ?? ''}
              onChange={e => {
                setCategoryId(parseInt(e.target.value))
                setCustomCategory('')
              }}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">-- เลือกหมวดหมู่ --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* เพิ่มหมวดหมู่ใหม่ */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              หรือเพิ่มหมวดหมู่ใหม่
            </label>
            <input
              type="text"
              placeholder="เช่น เสื้อผ้า, อาหาร"
              value={customCategory}
              onChange={e => setCustomCategory(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          {/* ปุ่ม */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md"
            >
              บันทึกสินค้า
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
