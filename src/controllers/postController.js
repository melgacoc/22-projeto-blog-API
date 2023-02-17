const PostService = require('../services/postService');
const { validCreator, validPost } = require('../validations/creatorValidation');
const { Category } = require('../models');

const getAll = async (_req, res) => {
    const posts = await PostService.getAll();
    return res.status(200).json(posts);
};

const getPostById = async (req, res) => {
    const { id } = req.params;
    const post = await PostService.getPostById(id);
    if (post === null) {
        return res.status(404).json({ message: 'Post does not exist' });
    }
    return res.status(200).json(post);
};

const addNewPost = async (req, res) => { // peguei a ideia que vi de um colega e adaptei pro meu tipo de validação
  const { id } = req.user;
  const { title, content, categoryIds } = req.body;
  const verifyCategory = await Category.findAll({ where: { id: categoryIds } });

  if (!title || !content || !categoryIds) {
    return res.status(400).json({ message: 'Some required fields are missing' });
  }

  if (verifyCategory.length < categoryIds.length) {
    return res.status(400).json({ message: 'one or more "categoryIds" not found' });
  }

  const newPost = await PostService.addNewPost(req.body, id);
  return res.status(201).json(newPost);
};

const attPost = async (req, res) => {
    const { id } = req.user; // preciso receber do token
    const { title, content } = req.body;

    validCreator(req, res);
    validPost(req, res);
    const { type, message } = await PostService.attPost(
        id, title, content, 
    );
    if (type === 404) return res.status(type).json({ message });
    return res.status(200).json(message);
};

const deletePost = async (req, res) => {
    const { id } = req.params;
    // validCreator(req, res);
    await PostService.deletePost(id);
    return res.status(204).end();
};

module.exports = {
    getAll,
    getPostById,
    attPost,
    deletePost,
    addNewPost,
};