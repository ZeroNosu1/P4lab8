import { NextResponse } from 'next/server'

let categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Accessories' },
    { id: 3, name: 'Home Appliances' },
]

export async function GET() {
    return NextResponse.json(categories)
}

export async function POST(req: Request) {
    const body = await req.json()
    const newCategory = {
        id: categories.length + 1,
        name: body.name,
    }
    categories.push(newCategory)
    return NextResponse.json(newCategory)
}
