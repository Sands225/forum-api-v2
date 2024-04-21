class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const {
      threadId, commentId, owner, replyId,
    } = useCasePayload;
    await this._threadRepository.checkThreadId(threadId);
    await this._commentRepository.checkCommentId(commentId);
    await this._replyRepository.checkReplyId(replyId);
    await this._replyRepository.checkReplyOwner(replyId, owner);
    await this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
