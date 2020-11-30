// 更新
const update_info = (tablename, { column1, column2 }, { key, val }) =>
	`update ${tablename} set ${key}=${val} where(${primaryKey}='${primaryval}')`;

// 删除
const delete_info = (tablename, { primaryKey, primaryval }) =>
	`delete from ${tablename} where(${primaryKey}=${primaryval})`;

module.exports = {
	update_info,
	delete_info,
};
