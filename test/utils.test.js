/* global describe, it */
import {expect} from 'chai';
import {db} from '../src/lib/utils';

describe('DBUtils', function() {
    it('Serializando Map', function() {
        const m = new Map([[0, 1], [1, 2], [2, 3]]);
        const sMap = db.serializeMap(m);
        expect(sMap).to.be.an('array');
        expect(sMap.length).to.equal(3);
    });
});
