class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { userId, threadId, commentId } = useCasePayload;
    await this._threadRepository.checkThreadId(threadId);
    await this._commentRepository.checkCommentId(commentId);
    await this._commentRepository.checkCommentOwner(userId, commentId);
    await this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
