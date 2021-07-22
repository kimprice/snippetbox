export type Ref = {
    sourceName: string;
    sourceLink: string;
    infoToDisplay: string[];
    keywords: string[];
    open: boolean;
    example?: string;
};
const ref1: Ref = {
    sourceName: "ASCII Table",
    sourceLink: "http://www.asciitable.com/",
    infoToDisplay: [
    "ASCII values for A-Z are 65-90",
    "ASCII values for a-z are 97-122", 
    "ASCII values for 0-9 are 48-57"
    ],
    keywords: ["ascii", "table", "value"],
    open: false,
};
const ref2: Ref = {
    sourceName: "Character Methods",
    sourceLink: "https://docs.oracle.com/javase/7/docs/api/java/lang/Character.html",
    infoToDisplay: [
    "isDigit(char ch)",
    "Determines if the specified character is a digit, returns a boolean.",
    "isUpperCase(char ch)",
    "Determines if the specified character is an uppercase character, returns a boolean."
    ],
    keywords: ["character", "digit", "letter", "char"],
    open: false,
};

const ref3: Ref = {
    sourceName: "Regular Expressions (Regex)",
    sourceLink: "https://www.w3schools.com/java/java_regex.asp#:~:text=Metacharacters%20are%20characters%20with%20a%20special%20meaning%3A%20,string%20a%20...%20%204%20more%20rows%20",
    infoToDisplay: [
    "import java.util.regex.Matcher;",
    "import java.util.regex.Pattern;"
    ],
    keywords: ["regular", "expression", "regex", "match"],
    open: false,
};
export const REFERENCES: Array<Ref> = [ref1, ref2, ref3];