/* eslint-disable no-undef */
const AddComment = require('../AddComment');

describe('AddComment entities', () => {
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const threadId = 255;
    const owner = 'user-123';
    const payload = {
      content: true,
    };
    const payloads = {
      threadId,
      owner,
      content: payload.content,
    };

    // Action and Assert
    expect(() => new AddComment(payloads)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when threadId is empty string', () => {
    // Arrange
    const threadId = '';
    const owner = 'user-123';
    const payload = {
      content: true,
    };
    const payloads = {
      threadId,
      owner,
      content: payload.content,
    };

    expect(() => new AddComment(payloads)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when owner is empty string', () => {
    // Arrange
    const threadId = 'thread-123';
    const owner = '';
    const payload = {
      content: true,
    };
    const payloads = {
      threadId,
      owner,
      content: payload.content,
    };

    expect(() => new AddComment(payloads)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when content is empty', () => {
    // Arrange
    const threadId = 'thread-123';
    const owner = 'user-123';
    const payload = {};
    const payloads = {
      threadId,
      owner,
      content: payload.content,
    };

    // Action and Assert
    expect(() => new AddComment(payloads)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should create AddComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'test comment content',
    };
    const payloads = {
      threadId: 'thread-123',
      owner: 'user-123',
      content: payload.content,
    };

    // Action
    const { threadId, owner, content } = new AddComment(payloads);

    // Assert
    expect(threadId).toEqual(payloads.threadId);
    expect(owner).toEqual(payloads.owner);
    expect(content).toEqual(payloads.content);
  });
});
