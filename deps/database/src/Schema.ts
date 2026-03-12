import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";
export type Generated<T> =
	T extends ColumnType<infer S, infer I, infer U>
		? ColumnType<S, I | undefined, U>
		: ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type ConfigTable = {
	id: string;
	data: unknown;
};
export type Config = Selectable<ConfigTable>;
export type NewConfig = Insertable<ConfigTable>;
export type ConfigUpdate = Updateable<ConfigTable>;
export type DefaultMessageTable = {
	id: string;
	ping_success: unknown;
};
export type DefaultMessage = Selectable<DefaultMessageTable>;
export type NewDefaultMessage = Insertable<DefaultMessageTable>;
export type DefaultMessageUpdate = Updateable<DefaultMessageTable>;
export type DB = {
	Config: ConfigTable;
	DefaultMessage: DefaultMessageTable;
};
