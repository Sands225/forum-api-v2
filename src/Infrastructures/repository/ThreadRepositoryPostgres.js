// const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThreadPayload) {
    const { owner, title, body } = addThreadPayload;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, body, owner',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async checkThreadId(threadId) {
    const id = threadId;
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Invalid thread ID');
    }
  }

  async getDetailThread(threadId) {
    const query = {
      text: `SELECT threads.id AS id, 
                    threads.title AS title,
                    threads.body AS body,
                    threads.date AS date,
                    users.username AS username
            FROM threads 
            INNER JOIN users 
            ON threads.owner = users.id
            WHERE threads.id = $1 `,
      values: [threadId],
    };
    const getThread = await this._pool.query(query);
    return getThread.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
