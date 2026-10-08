import { PrimitiveConstructor, PrimitiveProp, PrimitiveValue } from '@/utils'

export const getPrimitiveProp = <TypeConstructor extends PrimitiveConstructor>(type: TypeConstructor, required?: boolean, defaultValue?: PrimitiveValue<TypeConstructor>): PrimitiveProp<TypeConstructor> => {
  return {
    type,
    required: required ?? false,
    default: defaultValue
  }
}
