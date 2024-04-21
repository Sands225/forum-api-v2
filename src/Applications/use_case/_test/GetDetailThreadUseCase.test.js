/* eslint-disable no-undef */
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('GetDetailThreadUseCase', () => {
  it('should orchestring get detail thread action correctly', async () => {
    const threadId = 'thread-123';
    const useCasePayload = { threadId };
    const thread = {
      id: 'thread-123',
      title: 'a title',
      body: 'a body',
      date: '24-12-05 23:50:55',
      username: 'dicoding',
    };
    const comments = [{
      id: 'comment-123',
      username: 'dicoding',
      date: '24-12-05 23:50:55',
      content: 'first comment',
      isdelete: false,
    },
    {
      id: 'comment-456',
      username: 'dicoding',
      date: '24-12-05 23:50:55',
      content: 'second comment',
      isdelete: true,
    }];
    const replies = [{
      id: 'reply-123',
      commentid: 'comment-123',
      username: 'dicoding',
      content: 'a thread reply',
      date: '24-12-05 23:50:55',
      isdelete: false,
    },
    {
      id: 'reply-456',
      commentid: 'comment-123',
      username: 'dicoding',
      content: 'second thread reply',
      date: '24-12-05 23:50:55',
      isdelete: true,
    }];
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    // mocking needed function
    mockThreadRepository.checkThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.getReplies = jest.fn()
      .mockImplementation(() => Promise.resolve(replies));
    mockCommentRepository.getComments = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));
    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    // creating use case instance
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    const {
      isdelete: firstCommentIsDelete,
      ...firstComment
    } = comments[0];
    const {
      isdelete: secondCommentIsDelete,
      ...secondComment
    } = comments[1];
    const {
      commentid: firstReplyCommentId,
      isdelete: firstReplyIsDelete,
      ...firstReply
    } = replies[0];
    const {
      commentid: secondReplyCommentId,
      isdelete: secondReplyIsDelete,
      ...secondReply
    } = replies[1];
    const addRepliesToComments = [
      { ...firstComment, replies: [firstReply] },
      { ...secondComment, replies: [secondReply] },
    ];
    const expectedResult = {
      ...thread,
      comments: addRepliesToComments,
    };

    getDetailThreadUseCase._checkDeletedComment = jest.fn()
      .mockImplementation(() => [firstComment, secondComment]);
    getDetailThreadUseCase._checkDeletedReply = jest.fn()
      .mockImplementation(() => [firstReply, secondReply]);
    getDetailThreadUseCase._addRepliesToComments = jest.fn()
      .mockImplementation(() => addRepliesToComments);

    const detailedThread = await getDetailThreadUseCase.execute(useCasePayload);

    await expect(getDetailThreadUseCase.execute(useCasePayload))
      .resolves.not.toThrowError;
    expect(mockThreadRepository.checkThreadId)
      .toBeCalledWith(threadId);
    expect(mockCommentRepository.getComments)
      .toBeCalledWith(threadId);
    expect(mockReplyRepository.getReplies)
      .toBeCalledWith(threadId);
    expect(mockThreadRepository.getDetailThread)
      .toBeCalledWith(threadId);

    expect(detailedThread)
      .toEqual(expectedResult);

    expect(getDetailThreadUseCase._checkDeletedReply)
      .toBeCalledWith(replies);
    expect(getDetailThreadUseCase._checkDeletedComment)
      .toBeCalledWith(comments);
    expect(getDetailThreadUseCase._addRepliesToComments)
      .toBeCalledWith([firstReply, secondReply], [firstComment, secondComment]);
  });

  it('should called _checkDeletedReply correctly', async () => {
    const replies = [{
      id: 'reply-123',
      commentid: 'comment-123',
      username: 'dicoding',
      content: 'a thread reply',
      date: '24-12-05 23:50:55',
      isdelete: false,
    },
    {
      id: 'reply-456',
      commentid: 'comment-123',
      username: 'dicoding',
      content: 'second thread reply',
      date: '24-12-05 23:50:55',
      isdelete: true,
    }];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const result = await getDetailThreadUseCase._checkDeletedReply(replies);

    await expect(getDetailThreadUseCase._checkDeletedReply(replies))
      .resolves.not.toThrowError;
    expect(result[0].content).toEqual('a thread reply');
    expect(result[1].content).toEqual('**balasan telah dihapus**');
  });

  it('should called _checkDeletedComment correctly', async () => {
    const comments = [{
      id: 'comment-123',
      username: 'dicoding',
      date: '24-12-05 23:50:55',
      content: 'first comment',
      isdelete: false,
    },
    {
      id: 'comment-456',
      username: 'dicoding',
      date: '24-12-05 23:50:55',
      content: 'second comment',
      isdelete: true,
    }];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const result = await getDetailThreadUseCase._checkDeletedComment(comments);

    await expect(getDetailThreadUseCase._checkDeletedComment(comments))
      .resolves.not.toThrowError;
    expect(result[0].content).toEqual('first comment');
    expect(result[1].content).toEqual('**komentar telah dihapus**');
  });

  it('should called _addRepliesToComments', async () => {
    const replies = [{
      id: 'reply-123',
      commentid: 'comment-123',
      username: 'dicoding',
      content: 'a thread reply',
      date: '24-12-05 23:50:55',
    },
    {
      id: 'reply-456',
      commentid: 'comment-123',
      username: 'dicoding',
      content: '**balasan telah dihapus**',
      date: '24-12-05 23:50:55',
    }];
    const comments = [{
      id: 'comment-123',
      username: 'dicoding',
      date: '24-12-05 23:50:55',
      content: 'first comment',
    },
    {
      id: 'comment-456',
      username: 'dicoding',
      date: '24-12-05 23:50:55',
      content: '**komentar telah dihapus**',
    }];
    const expectedReplies = [{
      id: 'reply-123',
      username: 'dicoding',
      content: 'a thread reply',
      date: '24-12-05 23:50:55',
    },
    {
      id: 'reply-456',
      username: 'dicoding',
      content: '**balasan telah dihapus**',
      date: '24-12-05 23:50:55',
    }];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await expect(getDetailThreadUseCase
      ._addRepliesToComments(replies, comments))
      .resolves.not.toThrowError;
    await expect(getDetailThreadUseCase
      ._addRepliesToComments(replies, comments))
      .toStrictEqual([{
        content: 'first comment',
        date: '24-12-05 23:50:55',
        id: 'comment-123',
        replies: expectedReplies,
        username: 'dicoding',
      }, {
        content: '**komentar telah dihapus**',
        date: '24-12-05 23:50:55',
        id: 'comment-456',
        replies: [],
        username: 'dicoding',
      }]);
  });
});
