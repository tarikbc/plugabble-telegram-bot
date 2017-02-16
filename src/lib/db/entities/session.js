import mongoose, {Schema} from 'mongoose';

// Criação do Schema
const jsonSchema = {
    id: Number
    ,step: Number
    ,userData: [
        {
            key: Schema.Types.Mixed
            ,val: Schema.Types.Mixed
        }
    ]
};

const sessionSchema = new Schema(jsonSchema);

const Session = mongoose.model('Session', sessionSchema, 'sessions');

const Controller = {
    insert: d => {
        return new Promise(res => new Session(d).save(res));
    }
    ,select: q => {
        return new Promise((res, rej) => {
            Session.findOne(q, (err, data) => {
                if (err) rej(err);
                else res(data);
            });
        });
    }
    ,delete: q => {
        return new Promise((res, rej) => {
            Session.remove(q, (err, data) => {
                if (err) rej(err);
                else res(data);
            });
        });
    }
};

module.exports = Controller;
