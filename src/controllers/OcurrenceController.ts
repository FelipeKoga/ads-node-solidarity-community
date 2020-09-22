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
    });

    const missingFields = [];
    await schema.validate(body, { abortEarly: false }).catch((e) => {
      e.inner.forEach((err) => {
        missingFields.push(err.path);
      });
    });

    return missingFields.toString();
  };

  private handleAnonymousOcurrence = async (
    ocurrence: Ocurrence
  ): Promise<Ocurrence> => {
    if (ocurrence.anonymous === false) {
      return {
        ...ocurrence,
        user_name: (
          await UserSchema.findOne({ _id: ocurrence.user_id })
        ).toObject().name,
      };
    } else {
      delete ocurrence.user_id;
    }

    return ocurrence;
  };

  private mapOcurrences = async (
    ocurrences: Document[]
  ): Promise<Ocurrence[]> => {
    const ocurrencesWithUser: Ocurrence[] = [];
    const promises = ocurrences.map(async (ocurrence) => {
      ocurrencesWithUser.push(
        await this.handleAnonymousOcurrence(ocurrence.toObject())
      );
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

  public getAllOcurrences = async (
    _: NewRequest,
    res: Response
  ): Promise<Response> => {
    const ocurrences = await OcurrenceSchema.find({}, { __v: false });
    const ocurrencesWithUser = await this.mapOcurrences(ocurrences);
    return res.status(200).json(ocurrencesWithUser);
  };

  public getOcurrence = async (
    req: NewRequest,
    res: Response
  ): Promise<Response> => {
    try {
      console.log('Entrei 2');
      const ocurrenceId = req.params.id;
      if (!ocurrenceId) {
        return res
          .status(400)
          .json({ error: 'ID da ocorrência não encontrado' });
      }

      const ocurrence = await OcurrenceSchema.findById(ocurrenceId, {
        __v: false,
      });

      if (!ocurrence) {
        return res.status(400).json({ error: 'Ocorrência não encontrada' });
      }

      return res
        .status(200)
        .json(await this.handleAnonymousOcurrence(ocurrence.toObject()));
    } catch (e) {
      if (e.kind === 'ObjectId') {
        return res.status(400).json({ error: 'ID inválido' });
      }
      return res.status(400).json({ error: 'Ocorreu um erro' });
    }
  };

  public getUserOcurrences = async (
    req: NewRequest,
    res: Response
  ): Promise<Response> => {
    console.log('Entrei');
    try {
      const userId = req._id;
      const ocurrences = await OcurrenceSchema.find(
        { user_id: userId },
        { __v: false }
      );
      const ocurrencesWithUser = await this.mapOcurrences(ocurrences);
      return res.status(200).json(ocurrencesWithUser);
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

      const ocurrence = await OcurrenceSchema.findById(ocurrenceId);

      if (req.role !== 'admin' && ocurrence.toObject().user_id !== req._id) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const updateRes = await OcurrenceSchema.update(
        { _id: ocurrenceId },
        args
      );

      if (!updateRes) {
        return res.status(400).json({ error: 'Ocorrência não encontrada' });
      }

      return res.status(200).json();
    } catch (e) {
      if (e.kind === 'ObjectId') {
        return res.status(400).json({ error: 'ID inválido' });
      }
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

      const ocurrence = await OcurrenceSchema.findById(ocurrenceId);

      if (!ocurrence) {
        return res.status(400).json({ error: 'A ocorrência não existe' });
      }

      if (req.role !== 'admin' && ocurrence.toObject().user_id !== req._id) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      await OcurrenceSchema.remove({ _id: ocurrenceId });

      return res.status(200).json();
    } catch (e) {
      if (e.kind === 'ObjectId') {
        return res.status(400).json({ error: 'ID inválido' });
      }
      return res.status(400).json();
    }
  };
}

export default new OcurrenceController();
