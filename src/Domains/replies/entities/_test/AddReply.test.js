/* eslint-disable no-undef */
const AddReply = require('../AddReply');

describe('AddReply', () => {
  it('should return property error when given empty payload', async () => {
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should return data type error when given non-string payload', async () => {
    const payload = {
      owner: true,
      threadId: 555,
      commentId: 'comment-123',
      content: 'a thread reply',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return AddReply object correctly', async () => {
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'a thread reply',
    };

    const {
      owner, threadId, commentId, content,
    } = new AddReply(payload);

    expect(owner).toEqual(payload.owner);
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(content).toEqual(payload.content);
  });
});
