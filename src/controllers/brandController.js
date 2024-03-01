import { Brand } from '../models/models.js';
class BrandController {
  async create(req, res) {
    try {
      const { name } = req.body;
      const brandNew = await Brand.create({ name });
      return res.json(brandNew);
    } catch (error) {
      console.log(error);
    }
  }
  async getAll(req, res) {
    const brands = await Brand.findAll();
    return res.json(brands);
  }
}

export default new BrandController();
