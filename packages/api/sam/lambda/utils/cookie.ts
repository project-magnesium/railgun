const escape = (name: string) => {
    return name.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1');
};

export const getCookie = (cookie: string, name: string) => {
    const match = cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
};
