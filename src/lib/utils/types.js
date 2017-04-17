const hasType = (obj, type) => {
    switch (type) {
    case 'map': {
        const get = typeof obj.get === 'function';
        const set = typeof obj.set === 'function';
        return get && set;
    }
    default:
        return typeof obj === type;
    }
};

export {hasType};
