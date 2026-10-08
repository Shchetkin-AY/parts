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
    links: [
      {
        label: 'sales@iskor.ru',
        href: 'mailto:sales@iskor.ru',
        external: true
      },
      {
        label: '+7 (800) 123-45-67',
        href: 'tel:+78001234567',
        external: true
      }
    ]
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
