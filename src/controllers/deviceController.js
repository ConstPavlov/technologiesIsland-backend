import { Device, DeviceInfo } from '../models/models.js';
import { v4 as uuidv4 } from 'uuid'; // Правильный импорт для uuid v4
import path from 'path';
import { dirname } from 'path';
import { ApiError } from '../error/ApiError.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class DeviceController {
  async create(req, res, next) {
    try {
      console.log('Request body:', req.body);
      let { subsection, name, price, typeId, brandId, stock, info } = req.body;
      price = Number(price)
      typeId = Number(typeId)
      brandId = Number(brandId)
      const { imageUrl } = req.files;
      let fileName = uuidv4() + '.jpg';
      imageUrl.mv(path.resolve(__dirname, '..', 'static', fileName));

      console.log({
        subsection,
        name,
        price,
        stock,
        typeId,
        brandId,
        imageUrl: fileName,
      })
      const device = await Device.create({
        subsection,
        name,
        price,
        stock,
        typeId,
        brandId,
        imageUrl: fileName,
      });
      if (info) {
        info = JSON.parse(info);
        info.forEach((inf) => {
          DeviceInfo.create({
            title: inf.title,
            description: inf.description,
            deviceId: device.id,
          });
        });
      }
      res.json(device);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async getAll(req, res) {
    let { brandId, typeId, limit, page } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    let devices;
    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset });
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({ where: { brandId }, limit, offset });
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({ where: { typeId }, limit, offset });
    }
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({ where: { typeId, brandId }, limit, offset });
    }
    res.json(devices);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: 'info' }],
    });
    return res.json(device);
  }
}

export default new DeviceController();
