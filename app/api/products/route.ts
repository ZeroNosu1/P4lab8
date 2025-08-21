import { NextResponse } from 'next/server'

// เก็บตัวอย่างหมวดหมู่และสินค้าใน memory
let categories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Accessories' },
  { id: 3, name: 'Home Appliances' },
]

let products: any[] = [
  { id: 1, name: 'Notebook', description: '14 inch, Intel i5', price: 23900, categoryId: 1 },
  { id: 2, name: 'Wireless Mouse', description: 'Ergonomic design', price: 590, categoryId: 2 },
  { id: 3, name: 'Smartphone', description: '6.5 inch, 128GB', price: 12900, categoryId: 3 },
]

export async function GET() {
  // map category object ให้แต่ละ product
  const dataWithCategory = products.map(p => ({
    ...p,
    category: categories.find(c => c.id === p.categoryId) || null
  }))
  return NextResponse.json(dataWithCategory)
}

export async function POST(req: Request) {
  const body = await req.json()
  const newProduct = {
    id: products.length + 1,
    name: body.name,
    description: body.description,
    price: body.price,
    categoryId: body.categoryId,
  }
  products.push(newProduct)

  // ส่งกลับพร้อม category object
  return NextResponse.json({
    ...newProduct,
    category: categories.find(c => c.id === newProduct.categoryId) || null
  })
}
