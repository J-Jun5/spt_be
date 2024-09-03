
import { commentModel } from '../../models/commentModel.js';

export const getAllComments = {
  getAllComments: async (req, res) => {
    const articleId = parseInt(req.params.id);  // URL 경로에서 게시물 ID 가져오기
    const { cursor, limit = 10, sort = 'asc' } = req.query;  // 쿼리 스트링에서 페이지네이션 및 정렬 옵션 가져오기

    try {
      const comments = await commentModel.getAllComments({ articleId, cursor, limit, sort });
      res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
