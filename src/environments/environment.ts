const preFix = 'http://10.4.71.14:8080/api';
export const environment = {
    production: false,
    appVersion: 'v8.1.8',
    isMockEnabled: true,
    socketUrl: '',
    appId: 'BAN_CHEO',
    checkMeetingUrl: `${preFix}/check-url`,
    ldapLoginUrl: '${preFix}/ldap/authenticate',
    ldaUUrl: `${preFix}/ldap/`,
    feApiUrl: `${preFix}/rest/process`,
    genOTP: `${preFix}/api/otp/genOTP`,
    feApiFileUrl: `${preFix}/file/process`,
    feApiUrlDownloadFile: `${preFix}/file/download`,
    logoutTime: 5, // in minutes
    headerLdapLogin: {
        location: '0.0.0.0',
        context: 'PC',
        channel: 'ebank-register',
        subChannel: 'ebank-register',
    },
    headerFeApi: {
        reqType: 'REQUEST',
        api: 'sea-meetings',
        apiKey: 'qmklfoni1ezxlf2ckpygpfx248',
        priority: '1',
        channel: 'ASEANSC',
        subChannel: 'ASEANSC',
        context: 'WEB',
        userID: '',
        synasyn: 'true',
    },
};
