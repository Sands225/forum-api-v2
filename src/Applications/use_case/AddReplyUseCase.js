const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    const { threadId, commentId } = addReply;
    await this._threadRepository.checkThreadId(threadId);
    await this._commentRepository.checkCommentId(commentId);

    return this._replyRepository.addReply(useCasePayload);
  }
}

module.exports = AddReplyUseCase;
