import { FooterColumn, FooterLink } from '../interfaces'

export const footerColumns: FooterColumn[] = [
  {
    title: 'Карта сайта',
    links: [
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
  },
  {
    title: 'Каталог',
    links: [
      {
        label: 'Все комплекты',
        href: '/catalog'
      },
      {
        label: 'S-series',
        href: '/catalog?series=S-Series'
      },
      {
        label: 'R-series',
        href: '/catalog?series=R-Series'
      },
      {
        label: 'N-series',
        href: '/catalog?series=N-Series'
      }
    ]
  },
  {
    title: 'Комплектующие',
    links: [
      {
        label: 'Диски',
        href: '/accessories#disks'
      },
      {
        label: 'Карбон-керамика',
        href: '/accessories#ccb'
      },
      {
        label: 'Колодки',
        href: '/accessories#pads'
      },
      {
        label: 'Магистрали',
        href: '/accessories#lines'
      },
      {
        label: 'Крепёж',
        href: '/accessories#discs'
      }
    ]
  },
  {
    title: 'Контакты',
    links: []
  }
]

export const policyLinks: FooterLink[] = [
  {
    label: 'Политика конфиденциальности',
    href: '/privacy'
  },
  {
    label: 'Пользовательское соглашение',
    href: '/terms'
  }
]
