import {
  AboutHistoryItem,
  AboutMaterialSpec,
  AboutMediaCard,
  AboutPrecisionFeature,
  AboutStatCard
} from '../interfaces'

export const aboutHeroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyef1sPzM-GAz6ci4NlSXiggOwVGv7btZWJX8ESY4qFIZ23epxiZ_JU5ZUC9mSmgtgkgJcZgh3g83TS_FeA2Ro6_yJyKaBGPnn3aHyNIHA186uiVtOwociqElS5QgVYM1jSmQd6xvPwGR-W4orSYV3BQy-Ey9MQ62myX3pPTrQA6N9RzOd1wFUdhp-nNZ_ieSB3RHcupd79ZdmUJ_dt0EuTWiQcbQuaeJzx9zkS1Rmh95px0gGppB2Jgbkf444X7S9I1J1o3IyFFc'
export const aboutHistoryImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJLZqxWYEGUmmolPizZYD1B0tSd2drfsICvttytCL8tc4NkcEHM2lHYQ9RE4HsEgCL53ZrcX5RiVCUhqndre8oQUbBpWZuYlViLPTVrRt4OdrD35JuE8QtPhUDSCJKh1EeVpvQjIyg8Qq2is_axtuQKmgjrIkyTxXTfGZi9KtwDXPli3Tq4cbhOtGPLBFxKaaMRyeLSeWLiMGhth51l0CD3b5CDvXDDBofTse7ex6UMsHG7b7kAScG4LleibtF77VzYnVPH6N5UIs'
export const aboutForgingImagePressure = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtfpXS8kxI1cKUnOztU5ez4nkpIffNzE-U7RF00y9vo3ReT3L4MArGvRzSNmUMtzAaAd_TYsPqVEGib_AOvTZYaK4AJFBy4T0apZvoQyYZZmcPHJjML99_kcX-w3Xj9f6Y1gfGg2AwNgoJQCyOArYk7cRQPM6TM9NeWU49VLY7A2Jzcfr9oTSHK-FHTnc5g0Am-vUh00_Kk-xRIpUczXCaPWsY9-HexFsMOMM8BFsOVdQesLGSxgDxnDUvg6NHs9GIlzvYgi_TatM'
export const aboutForgingImageControl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnJcpwnpPPBCLX7nwmJ36mMYtBKNWP9LYs4FwH-ziIF86AVFYxmzEAKpBk9FErnhFM1rz50Tvn2MobCKeLaomYD_8h-QucXTokYFklJR7_GTJT4HtQu4By6FwMgp05GekzKEwhAaZBu8Nypf0YFccoBaUj_aKTZHct-OfmAqr6mtE6AjMn9vZZxBOce5LM3MPEJNhS98DJqraI2Dsjfrb8OTuTtF49C1qnD7T5ndkoi01c85DszLOaoFcpC8P_6KClp9BeNQOG--A'
export const aboutMaterialImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuACIj3m-PGJ2UzNEKkOnRxnr9mqBRf9leCSJ8PAuf9vXLol9kQeLzB_xdlPatTKnfN5rOoupHUHmSY1uRY4dW-vl3tDdmwH7CbYqxJkAxZQjP2_jckS4mkTzD2fngyq-WBjoR-Vg2wfwOJU56aoPi9ShRY8_vpExPOfr3ulrXwEd5MuDvjffx1ASU5Nsm2pr28BL-AB3T-CAQr32RH4L7Xsm5zs54h012x2G2pkTPUrqzGjWYVXcGSDlzoery19zQTJfdZrUQlsf_8'

export const aboutHistoryItems: AboutHistoryItem[] = [
  {
    accent: true,
    title: 'Фундамент',
    text: 'Savanini начинала как небольшое конструкторское бюро, специализирующееся на высоконагруженных узлах для аэрокосмической отрасли. Этот опыт сформировал наш подход к материалам.'
  },
  {
    title: 'Инновации',
    text: 'Переход к серийному производству автомобильных компонентов премиум-класса потребовал внедрения технологий, ранее доступных только в военной инженерии.'
  }
]

export const aboutForgingCards: AboutMediaCard[] = [
  {
    image: aboutForgingImagePressure,
    text: 'Close-up of industrial hydraulic press machinery in a dark environment with moody red lighting accents'
  },
  {
    image: aboutForgingImageControl,
    text: 'Interior of a modern robotic metal manufacturing facility with clean lines and blue-tinted cool lighting'
  }
]

export const aboutPrecisionStats: AboutStatCard[] = [
  {
    icon: 'architecture',
    value: '0.001mm',
    label: 'Допуск точности'
  },
  {
    icon: 'settings_input_component',
    value: '5-осевой ЧПУ',
    label: 'Обработка cnc'
  }
]

export const aboutPrecisionFeatures: AboutPrecisionFeature[] = [
  { text: 'Удаление микро-напряжений металла' },
  { text: 'Финишная полировка алмазными фрезами' },
  { text: 'Лазерная калибровка каждой единицы' }
]

export const aboutMaterialSpecs: AboutMaterialSpec[] = [
  {
    label: 'Предел прочности',
    value: '570 MPa'
  },
  {
    label: 'Твердость по Бринеллю',
    value: '150 HB'
  },
  {
    label: 'Усталостная прочность',
    value: 'Extreme'
  }
]
