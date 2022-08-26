const pool = require('../utils/pool');

module.exports = class Todo {
  id;
  user_id;
  description;
  done;
  created_at;

  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.description = row.description;
    this.done = row.done;
    this.created_at = row.created_at;
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      `
        SELECT *
        FROM todos
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
      [user_id]
    );

    return rows.map((todo) => new Todo(todo));
  } 
};

