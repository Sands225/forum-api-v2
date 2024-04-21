/* eslint-disable no-undef */
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should return added comment correctly', async () => {
      // Arrange
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

      const addComment = new AddComment({
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'a comment',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'a comment',
        owner: 'user-123',
      }));
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });
  });

  describe('checkCommentOwner', () => {
    it('should throw authorization error when user id does not match', async () => {
      // Arrange
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
      const commentId = 'comment-123';
      const invalidUserId = 'usr-3942';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action & Assert
      await expect(commentRepositoryPostgres
        .checkCommentOwner(invalidUserId, commentId))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not return any error when given valid userId, commentId, threadId', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
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
      const userId = 'user-123';
      const commentId = 'comment-123';
      const fakeIdGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator());

      // Action & Assert
      await expect(commentRepositoryPostgres
        .checkCommentOwner(userId, commentId))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment', () => {
    it('should set is_delete to be true', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
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
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action
      await commentRepositoryPostgres.deleteComment(commentId);
      const comments = await ThreadsTableTestHelper.checkThreadId(threadId, commentId);

      // Assert
      expect(comments.rows[0].is_delete).toEqual(true);
    });
  });

  describe('getComments by threadId', () => {
    it('should return correct value when getting comments', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
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
      const threadId = 'thread-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      const getComments = await commentRepositoryPostgres.getComments(threadId);

      expect(getComments[0].id).toEqual('comment-123');
      expect(getComments[0].username).toEqual('dicoding');
      expect(getComments[0].date).toBeTruthy();
      expect(getComments[0].content).toEqual('a comment');
      expect(getComments[0].isdelete).toEqual(false);
    });
  });

  describe('checkCommentId', () => {
    it('should return not found error when given invalid comment id', async () => {
      const commentId = 'xxx';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      await expect(commentRepositoryPostgres.checkCommentId(commentId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not return any error when given valid comment id', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
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
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      await expect(commentRepositoryPostgres
        .checkCommentId(commentId))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});
