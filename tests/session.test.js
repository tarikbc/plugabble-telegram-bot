/* global describe, it */
import Session from '../src/lib/Session';
import {expect} from 'chai';

describe('Session', () => {
    describe('Instaciando', () => {
        const s = new Session(12345);
        it('Id correto', () => {
            expect(s.id).to.equal(12345);
        });
        it('Step zerado', () => {
            expect(s.step).to.equal(0);
        });
        it('Command vazio', () => {
            expect(s.command).to.not.exist;
        });
        it('UserData vazio', () => {
            expect(s.userData.size).to.equal(0);
        });
    });

    describe('Estado das alterações', () => {
        const s = new Session(123456);
        s.command = 'teste';
        it('Sabe que tem que salvar no banco', () => {
            expect(s.changed).to.equal(true);
        });
        it('Sabe que não precisa salvar no banco', () => {
            s.save();
            expect(s.changed).to.equal(false);
        });
    });

    describe('Manipulando dados', () => {
        const s = new Session(123456);
        it('Definindo command', () => {
            s.command = 'echo';
            expect(s.command).to.equal('echo');
        });
        it('Definindo step', () => {
            s.step = 5;
            expect(s.step).to.equal(5);
        });
        it('Salvando dados do usuário', () => {
            s.setProp('nome', 'Fulano');
            expect(s.userData.get('nome')).to.equal('Fulano');
        });
        it('Recuperando dados do usuário', () => {
            expect(s.getProp('nome')).to.equal('Fulano');
        });
        it('Limpando dados do usuário', () => {
            s.clearProps();
            expect(s.userData.size).to.equal(0);
        });
    });

    describe('Finalizando sessão', () => {
        const s = new Session(123456);
        s.step = 5;
        s.command = 'echo';
        s.setProp('nome', 'Fulano');
        s.end();

        it('Command limpo', () => {
            expect(s.command).to.not.exist;
        });
        it('Step zerado', () => {
            expect(s.step).to.equal(0);
        });
        it('UserData limpo', () => {
            expect(s.userData.size).to.equal(0);
        });
        it('Id não alterado', () => {
            expect(s.id).to.equal(123456);
        });
    });

    describe('Manipulando step', () => {
        const s = new Session(123456);
        it('Próximo', () => {
            s.next();
            expect(s.step).to.equal(1);
        });
        it('Anterior', () => {
            s.step = 5;
            expect(s.step).to.equal(4);
        });
        it('Step nunca fica negativo', () => {
            s.step = 0;
            s.prev();
            expect(s.step).to.equal(0);
        });
    });
});
