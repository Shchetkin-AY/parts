import { Icons } from '../enums'
import { BenefitsItem } from '../interfaces'

export const BenefitsItems: BenefitsItem[] = [
  {
    icon: Icons.verified,
    title: 'Официальный дистрибьютор',
    text: 'Прямые поставки'
  },
  {
    icon: Icons.settings,
    title: 'Индивидуальные решения',
    text: 'Под заказ любой конфигурации'
  },
  {
    icon: Icons.delivery,
    title: 'Быстрая доставка',
    text: 'По всей России'
  },
  {
    icon: Icons.warranty,
    title: 'Гарантия и поддержка',
    text: '1 год'
  }
]
