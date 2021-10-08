const dayjs = require("dayjs");

const connection = require("../config/database");

class LabelService {
  async addTag(query) {
    const { type, name } = query;
    let time = dayjs().unix();
    const statement = `INSERT INTO label (type,name,create_time) VALUES (?,?,?)`;
    const [res] = await connection.execute(statement, [type, name, time]);
    console.log(res);
    return res;
  }
  async checkTagNameIsExist(query) {
    const { name } = query;
    const statement = `SELECT * FROM label WHERE name=? AND type =1`;
    const [res] = await connection.execute(statement, [name]);
    return res;
  }

  async getTagList(query) {
    try {
      const { pagination, name, start, limit, start_time, end_time } = query;
      let statement = `SELECT SQL_CALC_FOUND_ROWS id,name,create_time,group_count FROM label WHERE type =1 AND create_time BETWEEN ${
        start_time || 0
      } AND ${end_time || dayjs().unix()}`;
      if (name) {
        statement += ` AND name LIKE '%${name}'`;
      }
      if (pagination === "1") {
        statement += ` LIMIT ${start * limit},${limit}`;
      }
      const [res] = await connection.execute(statement);
      let countSql = `SELECT FOUND_ROWS() count`;
      const [countRes] = await connection.execute(countSql);
      return {
        data: res,
        count: countRes[0].count,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deletedSomeTag(query) {
    try {
      const { id } = query;
      console.log(id);
      const statement = `DELETE FROM label WHERE id=${id}`;
      console.log(statement);
      const [res] = await connection.execute(statement);
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  async checkDirectoryName(query) {
    try {
      const { name } = query;
      console.log(name);
      const statement = `SELECT * FROM label WHERE name=? AND type =2`;
      console.log(statement);
      const [res] = await connection.execute(statement, [name]);
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async addDirectory(query) {
    try {
      let { type, name, parent_id } = query;
      if (!parent_id) {
        parent_id = null;
      }
      let time = dayjs().unix();
      const statement = `INSERT INTO label (type,name,create_time,parent_id) VALUES (?,?,?,?)`;
      const [res] = await connection.execute(statement, [
        type,
        name,
        time,
        parent_id,
      ]);
      return res;
    } catch (error) {
      console.log(error)
    }
  }
  async getDirectoryList(query) {
    const { pagination, name, start, limit, start_time, end_time } = query;
    let statement = `SELECT SQL_CALC_FOUND_ROWS id,name,create_time,group_count FROM label WHERE type =2 AND create_time BETWEEN ${
      start_time || 0
    } AND ${end_time || dayjs().unix()}`;
    if (name) {
      statement += ` AND name LIKE '%${name}'`;
    }
    if (pagination === "1") {
      statement += ` LIMIT ${start * limit},${limit}`;
    }
    const [res] = await connection.execute(statement);
    let countSql = `SELECT FOUND_ROWS() count`;
    const [countRes] = await connection.execute(countSql);
    return {
      data: res,
      count: countRes[0].count,
    };
  }
}

module.exports = new LabelService();
