/* global describe, it */
import {expect} from 'chai';
import * as db from '../src/lib/db';
import dotenv from 'dotenv-safe';

dotenv.load();

/**
 * DATABASE sempre estará definido, pois vem do arquivo .env
 *  e o bot não sobe sem ele
 */

describe('Construindo string de conexão', function() {
    const DATABASE = process.env.MONGO_DATABASE;
    describe('Variáveis de conexão', function() {
        it('Somente DATABASE', function() {
            let connString = db.buildConnString();
            expect(connString).to.equals(`mongodb://localhost/${DATABASE}`);
        });

        it('DATABASE e HOST', function() {
            const connString = db.buildConnString({HOST: 'h'});
            expect(connString).to.equals(`mongodb://h/${DATABASE}`);
        });

        it('DATABASE e PORT', function() {
            const connString = db.buildConnString({PORT: 'p'});
            expect(connString).to.equals(`mongodb://localhost:p/${DATABASE}`);
        });

        it('DATABASE, HOST e PORT', function() {
            const connString = db.buildConnString({
                HOST: 'h'
                ,PORT: 'p'
            });
            expect(connString).to.equals(`mongodb://h:p/${DATABASE}`);
        });
    });

    describe('Variáveis de autenticação', function() {
        it('USER', function() {
            const connString = db.buildConnString({USER: 'u'});
            expect(connString).to.equals(`mongodb://u@localhost/${DATABASE}`);
        });

        it('PASSWORD', function() {
            const connString = db.buildConnString({PASSWORD: 'p'});
            expect(connString).to.equals(`mongodb://localhost/${DATABASE}`);
        });

        it('USER e PASSWORD', function() {
            const connString = db.buildConnString({
                USER: 'u'
                ,PASSWORD: 'p'
            });
            expect(connString).to.equals(`mongodb://u:p@localhost/${DATABASE}`);
        });
    });

    describe('Variáveis conexão + autenticação', function() {
        describe('HOST, PORT', function() {
            it('DATABASE, HOST, PORT, USER', function() {
                const connString = db.buildConnString({
                    HOST: 'h'
                    ,PORT: 'p'
                    ,USER: 'u'
                });
                expect(connString).to.equals(`mongodb://u@h:p/${DATABASE}`);
            });

            it('DATABASE, HOST, PORT, PASSWORD', function() {
                const connString = db.buildConnString({
                    HOST: 'h'
                    ,PORT: 'p'
                    ,PASSWORD: 'p'
                });
                expect(connString).to.equals(`mongodb://h:p/${DATABASE}`);
            });

            it('DATABASE, HOST, PORT, USER e PASSWORD', function() {
                const connString = db.buildConnString({
                    HOST: 'h'
                    ,PORT: 'p'
                    ,USER: 'u'
                    ,PASSWORD: 'p'
                });
                expect(connString).to.equals(`mongodb://u:p@h:p/${DATABASE}`);
            });
        });

        describe('PORT', function() {
            it('DATABASE, PORT, USER', function() {
                const connString = db.buildConnString({
                    PORT: 'p'
                    ,USER: 'u'
                });
                expect(connString).to.equals(
                    `mongodb://u@localhost:p/${DATABASE}`
                );
            });

            it('DATABASE, PORT, PASSWORD', function() {
                const connString = db.buildConnString({
                    PORT: 'p'
                    ,PASSWORD: 'p'
                });
                expect(connString).to.equals(
                    `mongodb://localhost:p/${DATABASE}`
                );
            });

            it('DATABASE, PORT, USER, PASSWORD', function() {
                const connString = db.buildConnString({
                    PORT: 'p'
                    ,USER: 'u'
                    ,PASSWORD: 'p'
                });
                expect(connString).to.equals(
                    `mongodb://u:p@localhost:p/${DATABASE}`
                );
            });
        });

        describe('HOST', function() {
            it('DATABASE, HOST, USER', function() {
                const connString = db.buildConnString({
                    HOST: 'h'
                    ,USER: 'u'
                });
                expect(connString).to.equals(`mongodb://u@h/${DATABASE}`);
            });

            it('DATABASE, HOST, PASSWORD', function() {
                const connString = db.buildConnString({
                    HOST: 'h'
                    ,PASSWORD: 'p'
                });
                expect(connString).to.equals(`mongodb://h/${DATABASE}`);
            });

            it('DATABASE, HOST, USER, PASSWORD', function() {
                const connString = db.buildConnString({
                    HOST: 'h'
                    ,USER: 'u'
                    ,PASSWORD: 'p'
                });
                expect(connString).to.equals(`mongodb://u:p@h/${DATABASE}`);
            });
        });
    });
});
