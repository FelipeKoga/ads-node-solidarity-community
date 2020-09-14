import { Ocurrence } from '@entities/Ocurrence';
import OcurrenceSchema from '@schemas/OcurrenceSchema';
import UserSchema from '@schemas/UserSchema';
import { Response } from 'express';
import { NewRequest } from 'src/utils/NewRequest';
import { object, string, number, boolean } from 'yup';

async function checkFields(body: Ocurrence) {
  const schema = object().shape({
    anonymous: boolean().required(),
    description: string().required(),
    ocurred_at: number().required(),
    zip_code: string().required(),
    latitude: number().required(),
    longitude: number().required(),
    neighborhood: string().required(),
    type: string().required(),
    street: string().required(),
    city: string().required(),
    complement: string(),
    number: number(),
  });

  const missingFields = [];
  await schema.validate(body, { abortEarly: false }).catch((e) => {
    e.inner.forEach((err) => {
      missingFields.push(err.path);
    });
  });

  return missingFields.toString();
}

class OcurrenceController {
  public async newOcurrence(req: NewRequest, res: Response): Promise<Response> {
    try {
      const missingFields = await checkFields(req.body);
      if (missingFields) {
        return res.status(400).json({
          error: `Campos obrigatórios não preenchidos: ${missingFields}`,
        });
      }

      const ocurrence = new OcurrenceSchema({ ...req.body, user_id: req._id });

      await ocurrence.save();
      return res.status(201).json();
    } catch (e) {
      return res.status(400).json();
    }
  }

  public async getOcurrences(
    req: NewRequest,
    res: Response
  ): Promise<Response> {
    const ocurrences = await OcurrenceSchema.find({}, { __v: false });

    const ocurrencesWithUser = [];
    const promises = ocurrences.map(async (ocurrence) => {
      const obj: Ocurrence = ocurrence.toObject();
      if (obj.anonymous === false) {
        ocurrencesWithUser.push({
          ...obj,
          user_name: (await UserSchema.findOne({ _id: obj.user_id })).toObject()
            .name,
        });
      } else {
        delete obj.user_id;
        ocurrencesWithUser.push(obj);
      }
    });
    await Promise.all(promises);
    return res.json(ocurrencesWithUser);
  }
}

export default new OcurrenceController();
