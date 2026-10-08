import { NavigationLink } from '../interfaces'

export const navigationLinks: NavigationLink[] = [
  {
    label: 'Главная',
    href: '/'
  },
  {
    label: 'Комплекты',
    href: '/catalog'
  },
  {
    label: 'Комплектующие',
    href: '/accessories'
  }
]

export const navigationScrollThreshold = 8
export const navigationHideThreshold = 120
