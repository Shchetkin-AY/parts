export type Primitive = string | number | boolean
export type PrimitiveConstructor = StringConstructor | NumberConstructor | BooleanConstructor
export type PrimitiveValue<TypeConstructor extends PrimitiveConstructor> =
  TypeConstructor extends StringConstructor ? string
    : TypeConstructor extends NumberConstructor ? number
      : boolean
