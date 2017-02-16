const serializeMap = map => {
    const _result = [];

    map.forEach((key, val) => {
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
        _result.set(x.key, x.value);
    });
    return _result;
};

export {serializeMap, deserializeMap};
