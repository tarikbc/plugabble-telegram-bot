import mongoose, {Schema} from 'mongoose';

mongoose.Promise = global.Promise;

// Criação do Schema
const jsonSchema = {
    id: Number
    ,command: String
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
        return new Promise((res, rej) => {
            const id = d.id;
            Session.findOne({id}, (err, doc) => {
                if (err)
                    rej(err);
                else if (!doc) {
                    new Session(d).save((err, data) => {
                        if (err) rej(err);
                        else res(data);
                    });
                } else {
                    doc.step = d.step;
                    doc.command = d.command;
                    doc.userData = d.userData;
                    doc.save((err, data) => {
                        if (err) rej(err);
                        else res(data);
                    });
                }
            });
        });
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
