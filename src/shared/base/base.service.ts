import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Document, DocumentDefinition, FilterQuery, Model, QueryOptions } from 'mongoose';

@Injectable()
export abstract class BaseService<T extends Document> {
  private readonly modelName: string;
  private readonly serviceLogger: Logger;

  protected constructor(
    logger: Logger,
    private readonly model: Model<T>,
  ) {
    this.serviceLogger = logger;

    for (const modelName of Object.keys(model.collection.conn.models)) {
      if (model.collection.conn.models[modelName] === this.model) {
        this.modelName = modelName;
        break;
      }
    }
  }

  async findOne(
    conditions: FilterQuery<T>,
    projection: string | Record<string, unknown> = {},
    options: Record<string, unknown> = {},
  ): Promise<T> {
    try {
      return await this.model.findOne(
        conditions,
        projection,
        options,
      );
    } catch (err) {
      this.serviceLogger.error(`Could not find ${this.modelName} entry:`);
      this.serviceLogger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async findMany(
    conditions: FilterQuery<T>,
    projection: string | Record<string, unknown> = {},
    options: Record<string, unknown> = {},
  ): Promise<T[]> {
    try {
      return await this.model.find(
        conditions as FilterQuery<T>,
        projection,
        options,
      );
    } catch (err) {
      this.serviceLogger.error(`Could not find ${this.modelName} entries:`);
      this.serviceLogger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async findOneOrNull(
    conditions: FilterQuery<T>,
    projection: string | Record<string, unknown> = {},
    options: Record<string, unknown> = {},
  ): Promise<T | null> {
    try {
      return this.findOne(conditions, projection, options);
    } catch (err) {
      return null;
    }
  }

  async updateOne(
    conditions: FilterQuery<T>,
    update?: any,
    options: Record<string, unknown> = {}
  ): Promise<T> {
    try {
      const defaultOptions = {
        new: true,
        useFindAndModify: false
      };

      return await this.model.findOneAndUpdate(
        conditions,
        update,
        { ...defaultOptions, ...options },
      );
    } catch (err) {
      this.serviceLogger.error(`Could not update ${this.modelName} entry:`);
      this.serviceLogger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async deleteOne(
    conditions: Partial<Record<keyof T, unknown>>,
    options?: QueryOptions | null
  ): Promise<T> {
    try {
      return await this.model.deleteOne(
        conditions as FilterQuery<T>,
        options,
      );
    } catch (err) {
      this.serviceLogger.error(`Could not delete ${this.modelName} entry:`);
      this.serviceLogger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async createOne(
    doc: T | DocumentDefinition<T>
  ): Promise<T> {
    try {
      return await this.model.create(doc);
    } catch (err) {
      this.serviceLogger.error(`Could not create ${this.modelName} entry:`);
      this.serviceLogger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
