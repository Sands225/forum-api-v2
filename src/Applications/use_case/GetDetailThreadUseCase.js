/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.checkThreadId(threadId);
    const getReplies = await this._replyRepository.getReplies(threadId);
    const getComments = await this._commentRepository.getComments(threadId);
    const getThread = await this._threadRepository.getDetailThread(threadId);

    const filteredReplies = this._checkDeletedReply(getReplies);
    const filteredComments = this._checkDeletedComment(getComments);

    const detailComments = this._addRepliesToComments(filteredReplies, filteredComments);

    const comments = [];
    for (let i = 0; i < detailComments.length; i += 1) {
      const newComments = {
        id: detailComments[i].id,
        username: detailComments[i].username,
        date: detailComments[i].date,
        replies: detailComments[i].replies,
        content: detailComments[i].content,
      };
      comments.push(newComments);
    }

    const detailThread = {
      id: getThread.id,
      title: getThread.title,
      body: getThread.body,
      date: getThread.date,
      username: getThread.username,
      comments,
    };
    return detailThread;
  }

  _addRepliesToComments(replies, comments) {
    for (let i = 0; i < comments.length; i += 1) {
      comments[i].replies = replies
        .filter((reply) => reply.commentid === comments[i].id)
        .map((reply) => {
          const { commentid, ...replyDetail } = reply;
          return replyDetail;
        });
    }
    return comments;
  }

  _checkDeletedReply(replies) {
    for (let i = 0; i < replies.length; i += 1) {
      if (replies[i].isdelete) {
        replies[i].content = '**balasan telah dihapus**';
      }
      delete replies[i].isdelete;
    }
    return replies;
  }

  _checkDeletedComment(comments) {
    for (let i = 0; i < comments.length; i += 1) {
      if (comments[i].isdelete) {
        comments[i].content = '**komentar telah dihapus**';
      }
      delete comments[i].isdelete;
    }
    return comments;
  }
}

module.exports = GetDetailThreadUseCase;
