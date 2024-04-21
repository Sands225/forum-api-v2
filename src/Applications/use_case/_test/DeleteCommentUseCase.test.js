/* eslint-disable no-undef */
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const useCasePayload = {
      userId,
      threadId,
      commentId,
    };

    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockThreadRepository.checkThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // creating use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    // Arrange
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .resolves.not.toThrowError;
    expect(mockThreadRepository.checkThreadId)
      .toBeCalledWith('thread-123');
    expect(mockCommentRepository.checkCommentId)
      .toBeCalledWith('comment-123');
    expect(mockCommentRepository.checkCommentOwner)
      .toBeCalledWith('user-123', 'comment-123');
    expect(mockCommentRepository.deleteComment)
      .toBeCalledWith('comment-123');
  });
});
