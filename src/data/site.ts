export interface NavItem {
  label: string
  to: string
}

export interface Product {
  slug: string
  name: string
  category: string
  price: string
  image: string
  rating: number
}

export const products: Product[] = [
  {
    slug: 'high-performance-brake-pads',
    name: 'High Performance Brake Pads',
    category: 'Brakes',
    price: '$48.00',
    image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f5f4?auto=format&fit=crop&w=1200&q=80',
    rating: 5
  },
  {
    slug: 'sport-air-filter',
    name: 'Sport Air Filter',
    category: 'Engine',
    price: '$32.00',
    image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80',
    rating: 4
  },
  {
    slug: 'led-headlight-kit',
    name: 'LED Headlight Kit',
    category: 'Lighting',
    price: '$86.00',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    rating: 5
  }
]
