export type User = {
    id: string;
    name: string;
    githubId: string;
};

export type State = 
    | {page: "todos"; text: string;}
    | {page: "contact"};
