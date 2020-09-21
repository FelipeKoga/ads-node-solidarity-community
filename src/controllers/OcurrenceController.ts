import { Ocurrence } from '@entities/Ocurrence';
import OcurrenceSchema from '@schemas/OcurrenceSchema';
import UserSchema from '@schemas/UserSchema';
import { Response } from 'express';
import { Document } from 'mongoose';
import { NewRequest } from 'src/utils/NewRequest';
import { object, string, number, boolean } from 'yup';

class OcurrenceController {
  private checkFields = async (body: Ocurrence): Promise<string> => {
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
  };

  private mapOcurrences = async (
    ocurrences: Document[]
  ): Promise<Ocurrence[]> => {
    const ocurrencesWithUser: Ocurrence[] = [];
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
    return ocurrencesWithUser;
  };

  public newOcurrence = async (
    req: NewRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const missingFields = await this.checkFields(req.body);
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
  };

  public getOcurrences = async (
    _: NewRequest,
    res: Response
  ): Promise<Response> => {
    const ocurrences = await OcurrenceSchema.find({}, { __v: false });
    const ocurrencesWithUser = await this.mapOcurrences(ocurrences);
    return res.json(ocurrencesWithUser);
  };

  public getUserOcurrences = async (
    req: NewRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req._id;
      const ocurrences = await OcurrenceSchema.find(
        { user_id: userId },
        { __v: false }
      );
      // const mappedOcurrences = await this.mapOcurrences(ocurrences);
      return res.status(200).json(ocurrences);
    } catch {
      return res.status(400).json();
    }
  };

  public updateOcurrence = async (
    req: NewRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const ocurrenceId = req.params.id;
      if (!ocurrenceId) {
        return res
          .status(400)
          .json({ error: 'ID da ocorrência não encontrado' });
      }

      const args: Ocurrence = req.body;
      const missingFields = await this.checkFields(args);
      if (missingFields) {
        return res.status(400).json({
          error: `Campos obrigatórios não preenchidos: ${missingFields}`,
        });
      }

      const updateRes = await OcurrenceSchema.findOneAndUpdate(
        { _id: ocurrenceId },
        args,
        {
          useFindAndModify: false,
        }
      );

      if (!updateRes) {
        return res.status(400).json({ error: 'A ocorrência não existe' });
      }

      return res.status(200).json();
    } catch {
      return res.status(400).json();
    }
  };

  public deleteOcurrence = async (
    req: NewRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const ocurrenceId = req.params.id;
      if (!ocurrenceId) {
        return res.status(400).json({ error: 'Missing occurrence id' });
      }

      const deleteRes = await OcurrenceSchema.findByIdAndDelete(ocurrenceId);

      if (!deleteRes) {
        return res.status(400).json({ error: 'A ocorrência não existe' });
      }

      return res.status(200).json();
    } catch {
      return res.status(400).json();
    }
  };
}

export default new OcurrenceController();
