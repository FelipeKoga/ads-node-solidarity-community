import { Ocurrence } from '@entities/Ocurrence';
import OcurrenceSchema from '@schemas/OcurrenceSchema';
import UserSchema from '@schemas/UserSchema';
import { Response } from 'express';
import { NewRequest } from 'src/utils/NewRequest';

function checkFields(body: Ocurrence) {
  const missingFields = [];
  if (body.anonymous === null || body.anonymous === undefined) {
    missingFields.push('anonymous');
  }

  if (!body.description) {
    missingFields.push('description');
  }

  if (!body.ocurred_at) {
    missingFields.push('ocurred_at');
  }

  if (!body.zip_code) {
    missingFields.push('zip_code');
  }

  if (!body.latitude) {
    missingFields.push('latitude');
  }

  if (!body.neighborhood) {
    missingFields.push('neighborhood');
  }

  if (!body.type) {
    missingFields.push('type');
  }

  if (!body.street) {
    missingFields.push('street');
  }

  if (!body.user_id) {
    missingFields.push('user_id');
  }

  if (!body.city) {
    missingFields.push('city');
  }

  return missingFields.toString();
}

class OcurrenceController {
  public async newOcurrence(req: NewRequest, res: Response): Promise<Response> {
    try {
      const missingFields = checkFields(req.body);
      if (missingFields) {
        return res.status(400).json({
          error: `Campos obrigatórios não preenchidos: ${missingFields}`,
        });
      }

      const ocurrence = new OcurrenceSchema(req.body);

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
          name: (await UserSchema.findOne({ _id: obj.user_id })).toObject()
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
