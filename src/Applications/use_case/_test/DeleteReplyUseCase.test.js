/* eslint-disable no-undef */
const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('DeleteReplyUseCase', () => {
  it('should orchestring delete reply action correctly', async () => {
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const useCasePayload = {
      owner,
      threadId,
      commentId,
      replyId,
    };

    // creating dependencies of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking needed function
    mockThreadRepository.checkThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkReplyId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // creating use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(useCasePayload);

    await expect(deleteReplyUseCase.execute(useCasePayload))
      .resolves.not.toThrowError;
    expect(mockThreadRepository.checkThreadId)
      .toBeCalledWith('thread-123');
    expect(mockCommentRepository.checkCommentId)
      .toBeCalledWith('comment-123');
    expect(mockReplyRepository.checkReplyId)
      .toBeCalledWith('reply-123');
    expect(mockReplyRepository.checkReplyOwner)
      .toBeCalledWith('reply-123', 'user-123');
    expect(mockReplyRepository.deleteReply)
      .toBeCalledWith('reply-123');
  });
});
