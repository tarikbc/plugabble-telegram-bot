/* global describe, it, before */
import Session from '../src/lib/Session';
import {expect} from 'chai';

describe('Session', function() {
    describe('Instaciando', function() {
        let s;

        before(function() {
            s = new Session(12345);
        });

        it('Id correto', function() {
            expect(s.id).to.equal(12345);
        });

        it('Step zerado', function() {
            expect(s.step).to.equal(0);
        });

        it('Command vazio', function() {
            expect(s.command).to.not.exist;
        });

        it('UserData vazio', function() {
            expect(s.userData.size).to.equal(0);
        });
    });

    describe('Estado das alterações', function() {
        let s;

        before(function() {
            s = new Session(123456);
        });

        it('Sabe que tem que salvar no banco', function() {
            s.command = 'teste';
            expect(s.changed).to.equal(true);
        });

        it('Sabe que não precisa salvar no banco', function() {
            s.save();
            expect(s.changed).to.equal(false);
        });
    });

    describe('Manipulando dados', function() {
        let s;

        before(function() {
            s = new Session(123456);
        });

        it('Definindo command', function() {
            s.command = 'echo';
            expect(s.command).to.equal('echo');
        });
        it('Definindo step', function() {
            s.step = 5;
            expect(s.step).to.equal(5);
        });
        it('Salvando dados do usuário', function() {
            s.setProp('nome', 'Fulano');
            expect(s.userData.get('nome')).to.equal('Fulano');
        });
        it('Recuperando dados do usuário', function() {
            expect(s.getProp('nome')).to.equal('Fulano');
        });
        it('Limpando dados do usuário', function() {
            s.clearProps();
            expect(s.userData.size).to.equal(0);
        });
    });

    describe('Finalizando sessão', function() {
        let s;
        before(function() {
            s = new Session(123456);
            s.step = 5;
            s.command = 'echo';
            s.setProp('nome', 'Fulano');
            s.end();
        });

        it('Command limpo', function() {
            expect(s.command).to.not.exist;
        });
        it('Step zerado', function() {
            expect(s.step).to.equal(0);
        });
        it('UserData limpo', function() {
            expect(s.userData.size).to.equal(0);
        });
        it('Id não alterado', function() {
            expect(s.id).to.equal(123456);
        });
    });

    describe('Manipulando step', function() {
        let s;

        before(function() {
            s = new Session(123456);
        });

        it('Próximo', function() {
            s.next();
            expect(s.step).to.equal(1);
        });
        it('Anterior', function() {
            s.step = 5;
            expect(s.step).to.equal(4);
        });
        it('Step nunca fica negativo', function() {
            s.step = 0;
            s.prev();
            expect(s.step).to.equal(0);
        });
    });
});
