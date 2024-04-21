/* eslint-disable no-undef */
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      username: 'dicoding',
      password: 'encrypted-password',
      fullname: 'Dicoding Indonesia',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'test title',
      body: 'test body',
      owner: 'user-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'a comment',
    });
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should return added reply correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'a thread reply',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      // Assert
      const replies = await RepliesTableTestHelper.checkReplyId('reply-123');
      expect(replies).toHaveLength(1);
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'a thread reply',
        owner: 'user-123',
      }));
    });
  });

  describe('checkReplyId function', () => {
    it('should return not found error', async () => {
      const replyId = 'xxx';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      await expect(replyRepositoryPostgres.checkReplyId(replyId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not return not found error', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'a thread reply',
      });
      const replyId = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      await expect(replyRepositoryPostgres.checkReplyId(replyId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('checkReplyOwner', () => {
    it('should return authentication error when access payload another user', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'a thread reply',
      });
      const replyId = 'reply-123';
      const invalidUserId = 'usr-345';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      await expect(replyRepositoryPostgres
        .checkReplyOwner(replyId, invalidUserId))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not return authentication error', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'a thread reply',
      });
      const replyId = 'reply-123';
      const userId = 'user-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      await expect(replyRepositoryPostgres
        .checkReplyOwner(replyId, userId))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReply', () => {
    it('should delete reply correctly', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'a thread reply',
      });
      const replyId = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      await replyRepositoryPostgres.deleteReply(replyId);
      const replies = await RepliesTableTestHelper.checkReplyId(replyId);

      expect(replies[0].is_delete).toEqual(true);
    });
  });

  describe('getReplies', () => {
    it('should return replies correctly from given threadId', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'a thread reply',
      });
      const threadId = 'thread-123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);
      const result = await replyRepositoryPostgres.getReplies(threadId);

      expect(result[0].id).toEqual('reply-123');
      expect(result[0].content).toEqual('a thread reply');
      expect(result[0].commentid).toEqual('comment-123');
      expect(result[0].username).toEqual('dicoding');
      expect(result[0].isdelete).toEqual(false);
    });
  });
});
