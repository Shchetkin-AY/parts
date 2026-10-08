import { PrimitiveConstructor, PrimitiveValue } from '../types'

export interface PrimitiveProp<TypeConstructor extends PrimitiveConstructor> {
  type: TypeConstructor
  required: boolean
  default?: PrimitiveValue<TypeConstructor>
}
