export type User = {
    id: string;
    name: string;
    githubId: string;
};

// export type State = 
//     | {page: "todos"; text: string;}
//     | {page: "contact"};
export type State = {
    listenSettingOn: boolean;
    notificationsSettingOn: boolean; 
    toolboxInitiated: boolean;
};
