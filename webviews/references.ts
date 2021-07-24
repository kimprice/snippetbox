export class Ref {
    private static numRefs: number = 0;
    private static allRefs: Array<Ref> = [];
    private id: number;
    private sourceName: string;
    private sourceLink: string;
    private infoToDisplay: string[];
    private keywords: string[];
    private open: boolean = false;
    private saved: boolean = false;
    private example?: string;

    public constructor (sourceName: string, sourceLink: string, infoToDisplay: string[], keywords: string[], example?: string) {
        this.id = ++Ref.numRefs;
        this.sourceName = sourceName;
        this.sourceLink = sourceLink;
        this.infoToDisplay = infoToDisplay;
        this.keywords = keywords;
        this.example = example;
        Ref.allRefs.push(this);
    }

    public getId() {
        return this.id;
    }

    public getSourceName() {
        return this.sourceName;
    }

    public getSourceLink() {
        return this.sourceLink;
    }

    public getInfoToDisplay() {
        return this.infoToDisplay;
    }

    public getKeywords() {
        return this.keywords;
    }

    public getExamples() {
        return this.example;
    }

    public isOpen() {
        return this.open;
    }

    public isSaved() {
        return this.saved;
    }

    public toggleOpenOrClose(openStatus?: boolean) {
        if (openStatus) { // specify open or closed
            this.open = openStatus;
        } else { // toggle
            this.open = !this.open;
        }
    }

    public toggleSaveStatus() {
        this.saved = !this.saved;
    }

    public static getRefById(id: number): Ref {
        return Ref.allRefs[id];
    }

 };
let ref1 = new Ref(
    "ASCII Table",
    "http://www.asciitable.com/",
    [
    "ASCII values for A-Z are 65-90",
    "ASCII values for a-z are 97-122", 
    "ASCII values for 0-9 are 48-57"
    ],
    ["ascii", "table", "value"],
);
let ref2 = new Ref(
    "Character Methods",
    "https://docs.oracle.com/javase/7/docs/api/java/lang/Character.html",
    [
    "isDigit(char ch)",
    "Determines if the specified character is a digit, returns a boolean.",
    "isUpperCase(char ch)",
    "Determines if the specified character is an uppercase character, returns a boolean."
    ],
    ["character", "digit", "letter", "char"],
);

let ref3 = new Ref(
    "Regular Expressions",
    "https://www.w3schools.com/java/java_regex.asp#:~:text=Metacharacters%20are%20characters%20with%20a%20special%20meaning%3A%20,string%20a%20...%20%204%20more%20rows%20",
    [
    "Regex",
    "import java.util.regex.Matcher;",
    "import java.util.regex.Pattern;"
    ],
    ["regular", "expression", "regex", "match"],
);
export let references: Array<Ref> = [ref1, ref2, ref3];