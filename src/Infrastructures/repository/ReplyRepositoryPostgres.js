const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReplyPayload) {
    const { commentId, owner, content } = addReplyPayload;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, comment_id, owner, content',
      values: [id, commentId, owner, content],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = \'true\' WHERE id = $1',
      values: [replyId],
    };
    await this._pool.query(query);
  }

  async checkReplyId(replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('invalid reply id');
    }
  }

  async checkReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, owner],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new AuthorizationError('reply does not belong to user');
    }
  }

  async getReplies(threadId) {
    const query = {
      text: `SELECT replies.id AS id, 
                    replies.content AS content, 
                    replies.date AS date, 
                    replies.comment_id AS commentId,
                    users.username AS username, 
                    replies.is_delete AS isDelete
            FROM replies
            INNER JOIN users ON replies.owner = users.id
            INNER JOIN comments ON replies.comment_id = comments.id 
            WHERE comments.thread_id = $1
            ORDER BY replies.date ASC`,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
