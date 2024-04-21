/* eslint-disable no-undef */
const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
  it('should throw error when value of owner did not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      owner: true,
      content: 'a comment',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when value of content did not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      content: [],
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when value of id did not meet data type specification', () => {
    const payload = {
      id: 255,
      owner: 'user-123',
      content: 'a comment',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when value of content is empty string', () => {
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      content: '',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should create AddedComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'test comment content',
    };
    const payloads = {
      id: 'comment-123',
      owner: 'user-123',
      content: payload.content,
    };

    // Action
    const { id, owner, content } = new AddedComment(payloads);

    // Assert
    expect(id).toEqual(payloads.id);
    expect(owner).toEqual(payloads.owner);
    expect(content).toEqual(payloads.content);
  });
});
