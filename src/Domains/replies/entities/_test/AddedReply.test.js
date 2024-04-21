/* eslint-disable no-undef */
const AddedReply = require('../AddedReply');

describe('AddedReply', () => {
  it('should return property error when given empty payload', async () => {
    const payload = {
      id: 'reply-123',
      owner: 'user-123',
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should return data type error when given non-string payload', async () => {
    const payload = {
      id: 'reply-123',
      content: true,
      owner: 'user-123',
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return AddReply object correctly', async () => {
    const payload = {
      id: 'reply-123',
      content: 'a thread reply',
      owner: 'user-123',
    };

    const {
      id, content, owner,
    } = new AddedReply(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
