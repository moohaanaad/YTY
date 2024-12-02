import { DeleteOptions } from "mongodb";
import { Document, Model, ProjectionType, QueryOptions, RootFilterQuery, Types, UpdateQuery } from "mongoose";


export abstract class AbstractRepositry<T> {
    constructor(private nModel: Model<T & Document>) { }

    create(item: T) {
        const model = new this.nModel(item)
        return model.save()
    }

    find(query?: RootFilterQuery<T>, param?: ProjectionType<T>, options?: QueryOptions<T>) {
        return this.nModel.find(query, param, options)
    }

    findOne(query?: RootFilterQuery<T>, param?: ProjectionType<T>, options?: QueryOptions<T>) {
        return this.nModel.findOne(query, param, options)
    }
    findOneAndUpdate(query: RootFilterQuery<T>, item: any, options?: QueryOptions<T>) {
        return this.nModel.findOneAndUpdate(query, item, options)
    }
    findOneAndDelete(query: RootFilterQuery<T>, options?: QueryOptions<T>) {
        return this.nModel.findOneAndDelete(query, options)
    }

    findById(id: Types.ObjectId, document?: Document, options?: QueryOptions<T>) {
        return this.nModel.findById(id, document, options)
    }
    findByIdAndUpdate(id: Types.ObjectId, item: any, options?: QueryOptions<T>) {
        return this.nModel.findByIdAndUpdate(id, item, options)
    }
    findByIdAndDelete(id: Types.ObjectId, options?: QueryOptions<T>) {
        return this.nModel.findByIdAndDelete(id, options)
    }

    updateOne(query: RootFilterQuery<T>, item: any, options?: UpdateQuery<T>) {
        return this.nModel.updateOne(query, item, options)
    }
    updateMany(query: RootFilterQuery<T>, item: any, options?: UpdateQuery<T>) {
        return this.nModel.updateMany(query, item, options)
    }

    delteOne(query: RootFilterQuery<T>, options?: DeleteOptions) {
        return this.nModel.deleteOne(query, options)
    }
    deleteMany(query: RootFilterQuery<T>, options?: DeleteOptions) {
        return this.nModel.deleteMany(query, options)
    }

}