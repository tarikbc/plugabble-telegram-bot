const serializeMap = map => {
    const _result = [];

    map.forEach((val, key) => {
        _result.push({
            key
            ,val
        });
    });

    return _result;
};

const deserializeMap = data => {
    const _result = new Map();
    data.forEach(x => {
        _result.set(x.key, x.val);
    });
    return _result;
};

export default {serializeMap, deserializeMap};
