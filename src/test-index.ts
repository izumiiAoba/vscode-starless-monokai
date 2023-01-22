export type MapType<Obj extends Record<string, any>, OriginType, TargetType> = {
    [Prop in keyof Obj]: OriginType extends Obj[Prop] ?
        Exclude<Obj[Prop], OriginType> | TargetType
        : Obj[Prop] extends unknown[] ?
            OriginType extends Obj[Prop][number] ?
                TargetType[]
                : Obj[Prop]
            : Obj[Prop]
};
